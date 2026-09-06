---
title: Casos de prueba de penetración
resumen: 'Los dos casos completos del deck de pentesting: Michigan Terminal System, donde un parámetro que apunta a la propia lista de parámetros termina en control total, y un ataque de ingeniería social que consigue contraseñas por teléfono.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[metodologia-de-hipotesis-de-falla]]", "[[verificacion-formal-y-prueba-de-penetracion]]", "[[video-09-pentesting-metodologia]]"]
aliases: [Casos de prueba de penetración, Caso Michigan Terminal System, MTS (pentesting), Ataque externo por ingeniería social, Caso de la secretaria del director, Line input]
type: concepto
unidad: 2
clase: 8
orden: 10
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, pentesting, hipotesis-de-falla, michigan-terminal-system, ingenieria-social, clase-08, sin-dictar]
sources: ["Clase 13 - Pentesing.pdf"]
---

# Casos de prueba de penetración

**Los cinco pasos de la [[metodologia-de-hipotesis-de-falla|Metodología de Hipótesis de Falla]] aplicados de punta a punta, dos veces, contra dos objetivos que no podrían ser más distintos: un sistema operativo de 1967 del que se explota dos bytes mal validados, y una empresa entera de la que se extrae información sensible sin tocar una sola línea de código.** Son los dos únicos ejemplos completamente desarrollados de todo el deck de Pentesting, y el material más concreto de toda la clase.

Cubre las filminas **17 a 29** del deck de Pentesting. **Esta clase todavía no se dictó** (hoy es 04/09/2026); lo que sigue está escrito contra el PDF, cruzado con [[video-09-pentesting-metodologia|video-09]], que resuelve los dos casos con el mismo nivel de detalle, más lecturas propias rotuladas como tales.

## Caso: Michigan Terminal System

*Filminas 17-24.* Sistema operativo real que corría en mainframes **IBM 360/370** (Bishop lo documenta en *Computer Security: Art and Science*). **Objetivo de la prueba**: obtener acceso a las estructuras de control del sistema. **Nivel inicial**: cuenta autorizada, nivel 3 —el más alto de los tres niveles incrementales de atacante de [[metodologia-de-hipotesis-de-falla#Punto de partida: tres niveles incrementales de atacante|Metodología de hipótesis de falla]]—. La filmina 17 aclara en un recuadro que **esta prueba de penetración contaba con la aprobación de los administradores**: no es un ataque encubierto, es un pentest autorizado, y por eso el equipo puede arrancar directamente desde una cuenta legítima en vez de tener que conseguirla.

### Paso 1 — Recolección de información

Al correr un programa, la memoria se divide en segmentos:

| Segmentos | Contenido | Qué puede hacer el proceso |
|---|---|---|
| 0 a 4 | Supervisor, programas de sistema y estado | **Nada** — protegidos por mecanismos de **hardware** |
| 5 | Área de trabajo del sistema, con la información de privilegio del proceso | **No puede alterarla**; en modo usuario ni siquiera se mapea a su espacio de direcciones |
| 6 en adelante | Información del proceso | Puede **modificarla libremente** |

El proceso corre en **modo usuario** y realiza *system calls*, que corren en **modo sistema**. El código de la *system call* revisa los parámetros — en particular, que los punteros pertenezcan a zonas accesibles por el proceso—. Los parámetros se construyen como una **lista de direcciones en el segmento del usuario**, y esa lista se pasa como una dirección en un registro.

**Por qué esta convención de llamada es el dato que decide todo el ataque:** la validación de un *system call* revisa que los punteros de la lista de parámetros apunten a zonas del segmento del proceso, pero la lista de parámetros **en sí misma** también vive en el segmento del proceso — y nada, hasta acá, impide que un elemento de la lista apunte a **otro elemento de la misma lista**.

### Paso 2 — Hipótesis

La pregunta que dispara todo el ataque: **¿qué ocurriría si la dirección de un parámetro apunta a la lista misma de parámetros?** Sin controles extra, algún *system call* podría escribir en la dirección del parámetro **después de haber pasado la validación** — y si se puede controlar qué valor se escribe ahí, sería posible leer o escribir cualquier zona del segmento 5.

Nótese la estructura exacta de la hipótesis: no dice "el sistema tiene una falla de seguridad" en general, dice una cosa puntual y falsable —*la dirección de un parámetro puede apuntar a la lista de parámetros, y eso no está prohibido por la validación*—, exactamente el formato que exige el paso 2 de la metodología.

### Paso 3 — Prueba

Hace falta un *system call* que use esa convención de llamada, tenga al menos dos parámetros y altere uno de ellos con un valor controlable. El elegido es **`line input`**, que lee una línea de texto y retorna su **número de línea** y su **longitud**.

- **Setup**: hacer que la dirección donde se almacenará el *número de línea* sea la dirección de la *longitud de línea*.
- **Ejecución**:
  1. el *system call* valida los parámetros — todos pertenecen al segmento del proceso, así que pasa la validación;
  2. ejecuta *read input line*;
  3. el número de línea se guarda según la lista de parámetros, **reescribiendo la dirección del otro parámetro**;
  4. la longitud se guarda escribiendo el valor **en el segmento 5**.

**Por qué el orden de los pasos 3 y 4 de la ejecución es la clave del ataque.** El *setup* apunta el parámetro "número de línea" hacia la dirección del parámetro "longitud de línea" — es decir, hacia una posición dentro de la propia lista de parámetros. Cuando el *system call* escribe el número de línea (paso 3), no está escribiendo un dato cualquiera: está **reescribiendo, dentro de la lista de parámetros ya validada, la dirección donde se va a escribir el siguiente valor**. Y esa nueva dirección puede apuntar a cualquier lugar del segmento 5, porque **la validación de punteros ya ocurrió antes**, en el paso 1 de la ejecución — no se vuelve a correr. Cuando el *system call* escribe la longitud (paso 4), lo hace contra la dirección recién reescrita, que ya no apunta adentro de la lista de parámetros sino adentro del segmento protegido. **La validación es correcta en el momento en que se ejecuta; lo que falla es que el sistema no vuelve a validar después de que el propio *system call* modificó, como efecto colateral legítimo de su funcionamiento, el destino de su segunda escritura.**

### Paso 4 — Generalización

No se puede escribir en los segmentos 0 a 4, protegidos por hardware. Pero en el segmento 5 vive el **nivel de privilegio** del proceso, que determina si puede hacer llamadas de **nivel supervisor** en lugar de *system calls* — y una función de nivel supervisor **apaga la protección por hardware**.

**Conclusión**: la vulnerabilidad permite modificar cualquier dirección de cualquier segmento, es decir, controlar completamente la computadora. La cadena lógica completa, de la hipótesis a la generalización, es:

$$\text{escribir 2 bytes en el segmento 5} \;\Rightarrow\; \text{elevar el nivel de privilegio del proceso} \;\Rightarrow\; \text{habilitar llamadas de nivel supervisor} \;\Rightarrow\; \text{apagar la protección por hardware} \;\Rightarrow\; \text{control total}$$

Escribir dos bytes en el lugar correcto termina en control total: ése es el punto del ejemplo, y la razón por la que la generalización es —según la propia filmina 15 de la metodología— la parte más importante de toda la prueba. Nada de esto es visible mirando sólo el paso 3: el hallazgo aislado es "se puede escribir un valor inesperado en el segmento 5"; la generalización es lo que conecta esa escritura puntual con el hecho de que el segmento 5 contiene, entre otras cosas, el interruptor que decide si el hardware sigue protegiendo algo.

## Caso: ataque externo por ingeniería social

*Filminas 25-29.* **Objetivo**: determinar si las medidas de seguridad de una empresa eran efectivas para evitar que un atacante ingrese al sistema. **El test se enfoca en políticas y procedimientos, tanto técnicos como no técnicos** — no hay una sola línea de código en todo este caso, y es exactamente el contrapeso del caso anterior: si Michigan Terminal System prueba que un pentest puede ser puramente técnico, éste prueba que la definición de la filmina 5 —*"prueba al sistema como un todo"*— no es retórica.

### Paso 1 — Recolección de información

Búsqueda en internet de nombres de empleados y directores; teléfono de la sucursal local, y a través de ella, el **reporte anual** —público, porque la empresa cotizaba en bolsa—. Con eso se reconstruyen partes del organigrama, nombres de proyectos y quién trabaja en cada uno.

El tester se hace pasar por un **nuevo empleado** y aprende, en esa interacción, que para enviar cualquier documento hacen falta un **número de empleado** y un **centro de costos**. Con ese dato aprendido llama entonces a la secretaria del director sobre el que más información había recabado, **dos veces**: primero haciéndose pasar por un empleado, para conseguir el número de empleado del director; después haciéndose pasar por un auditor, para conseguir el centro de costos. Con esos dos datos, solicita que se envíe el listado completo de empleados a una consultora externa.

**Por qué la recolección se hace en dos llamadas y no en una.** Cada llamada usa una identidad distinta —empleado, después auditor— porque cada dato pedido tiene un solicitante plausible distinto: un empleado nuevo preguntando su propio número de legajo es normal; un empleado preguntando el centro de costos de otro departamento, no. El auditor sí puede pedir esa segunda cosa sin levantar sospecha. Es el mismo principio de **compartimentar la información según a quién le corresponde pedirla** que aparece, del lado defensivo, en [[clase-08-principios-de-diseno-y-vulnerabilidades#1.6. Separación de privilegios|Separación de privilegios]]: acá el atacante explota exactamente que el receptor de cada llamada no tiene forma de verificar la identidad reclamada contra la pertinencia del pedido.

### Paso 2 — Hipótesis

*Los empleados nuevos no conocen todos los procesos y controles: es posible que un nuevo empleado brinde información sensitiva.*

### Paso 3 — Prueba

El tester llama a Recursos Humanos **impersonando a la secretaria de un director**: se queja de que no le informaron de los nuevos ingresos y los pide, y obtiene los nombres. Después llama a cada uno de esos nuevos empleados, **haciéndose pasar por un operador del centro de cómputos**, y les da un "entrenamiento de seguridad" por teléfono — durante el cual obtiene tipos de sistemas usados, número de usuarios, *logins* y contraseñas.

`video-09` (1:14:20) agrega en voz el detalle final del guion: Ramele lo representa actuando el diálogo típico —una supuesta multa administrativa por no poner asterisco y paréntesis en la contraseña, que "se resuelve" si el empleado la dice en voz alta para verificarla—. Es el cierre perfecto de la vulnerabilidad hipotetizada en el paso 2: el "entrenamiento de seguridad" es, en sí mismo, la explotación de que un empleado nuevo no tiene forma de distinguir un procedimiento legítimo de uno fabricado.

Según [[video-09-pentesting-metodologia#6. Ejemplo resuelto: ataque externo por ingeniería social|video-09]], este es el caso que la cátedra usa para asentar dónde ocurren los ataques reales hoy:

> [!quote]- Del video 09 — dónde pasan los ataques de verdad (1:18:58)
> "Difícilmente haya scams actuales que sean simplemente por romper un esquema criptográfico."

La ingeniería social, no la ruptura de un algoritmo, es el vector más común en la práctica — y es la razón por la que este caso, sin una sola línea de código, tiene tanto peso metodológico como el de Michigan Terminal System.

## Los dos casos, uno al lado del otro

| | Michigan Terminal System | Ataque externo por ingeniería social |
|---|---|---|
| Nivel inicial de atacante | 3 — cuenta autorizada | 1 — externo, sin conocimiento previo |
| Qué se explota | Una convención de llamada del sistema operativo | Que nadie verifica una identidad reclamada por teléfono |
| Paso 3 | Ejecutar un *system call* preparado | Dos llamadas telefónicas con identidades fabricadas |
| Paso 4 (generalización) | De "escribir 2 bytes" a "control total de la máquina" | Implícito: el mismo guion sirve contra cualquier empleado nuevo, no sólo contra el que se llamó |
| Qué principio de diseño queda expuesto | [[clase-08-principios-de-diseno-y-vulnerabilidades#1.4. Mediación completa\|Mediación completa]] — la revalidación no ocurre en cada escritura | [[clase-08-principios-de-diseno-y-vulnerabilidades#1.8. Aceptación psicológica\|Aceptación psicológica]] y [[clase-08-principios-de-diseno-y-vulnerabilidades#1.6. Separación de privilegios\|Separación de privilegios]] — el proceso de verificación cede ante la urgencia y la autoridad reclamada |

*(La columna del principio de diseño es lectura nuestra: ninguna filmina de Pentesting conecta explícitamente los dos casos con los ocho principios de la [[principios-de-diseno|Clase 07]], pero la conexión se sigue directamente de sus definiciones.)*

## Ver también

- [[clase-08-principios-de-diseno-y-vulnerabilidades#10. Casos de prueba de penetración|Clase 08 — Principios de diseño y vulnerabilidades, §10 Casos de prueba de penetración]]
- [[metodologia-de-hipotesis-de-falla|Metodología de hipótesis de falla]] — los cinco pasos que estos dos casos ejecutan
- [[verificacion-formal-y-prueba-de-penetracion|Verificación formal y prueba de penetración]] — la definición que estos casos instancian
- [[validez-de-las-pruebas-de-penetracion|Validez de las pruebas de penetración]] — hasta dónde se puede generalizar lo que estos dos casos encontraron
- [[principios-de-diseno|Principios de diseño]] — Mediación completa, Separación de privilegios y Aceptación psicológica, los tres principios que estos dos casos dejan expuestos
- [[video-09-pentesting-metodologia#5. Ejemplo resuelto: Michigan Terminal System|Video 09 — Pentesting: metodología, §5 y §6]] — resuelve los dos casos con el mismo nivel de detalle que esta nota, y agrega la actuación del diálogo del caso de ingeniería social
