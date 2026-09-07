---
title: Listas de control de acceso
resumen: 'Proyección por columnas de la matriz de acceso, donde cada objeto guarda la lista de sujetos y sus derechos con denegar por defecto, más los problemas de grupos, conflictos Grant-All o First-Rule, defaults y revocación en cascada.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[matriz-de-control-de-acceso]]", "[[lenguajes-de-descripcion-de-politicas]]"]
aliases: [Listas de control de acceso, ACL, Access Control List, Traspaso y delegación, Grant-All y First-Rule, Override y Augment]
type: concepto
unidad: 2
clase: 6
orden: 11
created: 2026-09-04
updated: 2026-09-04
tags: [control-de-acceso, acl, grupos, revocacion, clase-06, sin-dictar]
sources: ["Clase 08 - Control de acceso.pdf"]
---

# Listas de control de acceso

**Cómo se guarda, objeto por objeto, quién puede hacer qué — y los cinco problemas concretos que aparecen apenas ese modelo simple se usa en un sistema real: pertenencia, grupos, conflictos, defaults y revocación.** Es la proyección de la [[matriz-de-control-de-acceso|matriz de control de acceso]] por **columnas**, y el mecanismo más difundido de los dos que estudia la clase.

*Filminas 4 a 13 del deck de Control de acceso (`Clase 08 - Control de acceso.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—; esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales. No hay transcripción, pero hay una confirmación indirecta en video de que el tema se dicta con Pablo: ver la cita al final.*

## Definición

Con $S$ conjunto de sujetos, $O$ conjunto de objetos y $R$ conjunto de acciones (derechos):

$$ACL(o) = \{(s_i, r_i) \mid s_i \in S,\ r_i \subseteq R\}$$

$(s_i, r_i) \in ACL(o)$ significa que $s_i$ puede acceder a $o$ con cualquier derecho de $r_i$ *(la filmina 5 escribe «derecho de $i_r$», con el subíndice invertido — errata de la filmina)*. La regla que cierra la definición es la que domina toda la sección:

> **Si un sujeto no tiene entrada en $ACL(o)$, no tiene ningún derecho sobre $o$ — principio de denegar por defecto.**

Es la misma idea que los [[lenguajes-de-descripcion-de-politicas|lenguajes cerrados]] de la sección 4 (*deny by default*, listar lo que se permite) y que reaparece, con otro vocabulario, en la [[composicion-de-politicas#Cuándo la composición es trivial, y cuándo no|composición de políticas]].

## Pertenencia y transferencia de permisos

El derecho de **pertenencia** (`own`) puede asignarse a quien crea el objeto, o según el tipo de objeto — el deck no fija una regla única, deja las dos opciones abiertas.

Sobre mover permisos entre sujetos hay dos operaciones distintas, que conviene no confundir:

- **Traspaso** — cambia el sujeto de una entrada existente, sin dejar rastro del anterior:
$$(\text{Usuario 1}, t\ rwx) \;\to\; (\text{Usuario 2}, t\ rwx)$$
- **Delegación** — agrega un sujeto **nuevo** conservando el original, con dos variantes según si el derecho de volver a transferir ($t$) se conserva:
$$(U_1, t\ rx) \;\to\; (U_1, t\ rx),\ (U_2, rx) \qquad \text{(con } t\text{: } U_2 \text{ puede volver a delegar)}$$
$$(U_1, t\ rx) \;\to\; (U_1, t\ rx),\ (U_2, r) \qquad \text{(sin } t\text{, y con menos derecho: } U_2 \text{ ni siquiera puede ejecutar)}$$

La diferencia de fondo: el traspaso **mueve** un derecho, la delegación lo **multiplica** — y por eso la delegación es la que después necesita una política de revocación en cascada (ver más abajo), mientras que el traspaso, al no dejar copias, no la necesita.

## Usuarios privilegiados

Dos formas distintas de "estar por encima" del modelo, y no son lo mismo:

- **Exentos de todo ACL** — `root` en Linux: acceso total sin excepción, el sistema ni siquiera consulta un ACL para él.
- **Con ACLs especiales** — `administrator` en Windows 200x: tiene el derecho `take ownership` sobre todos los objetos, pero **sigue siendo una entrada de ACL**, no una exención total del modelo.

## Grupos: el volumen y sus conflictos

**Manejo de volumen (filmina 8).** Los ACLs crecen menos que la matriz completa, pero siguen creciendo mucho. En la práctica se usan **grupos** (roles) — que **no pertenecen al modelo clásico de ACLs**, son una extensión de ingeniería sobre él. Con $g = \{s_1,\dots,s_i \mid s \in S\}$ un grupo:

$$(g, r) \in ACL(o) \implies (s_1, r'_1) \in ACL(o)\ \dots\ (s_i, r'_i) \in ACL(o), \quad \text{con } r \subseteq r'_i \text{ para cada } i$$

En prosa: una entrada de grupo actúa como un **piso**, no como un techo *(lectura nuestra: la filmina 8 da solo la fórmula, no esta caracterización)* — cada miembro del grupo recibe al menos $r$, pero puede tener además una entrada individual que le dé más ($r'_i \supseteq r$). Los grupos reducen el tamaño del ACL, pero agregan una dimensión de complejidad nueva: **qué pasa cuando la entrada de grupo y una entrada individual dicen cosas distintas**.

### Conflictos, resueltos con el mismo escenario de la filmina

**Escenario (filmina 9).** $ACL(o) = \{(\text{Pablo}, rw), (\text{Profesores}, r)\}$, con $\text{Pablo} \in \text{Profesores}$. Dos políticas de resolución, incompatibles entre sí:

- **Grant-All** — exige que **todos** los ACs aplicables otorguen el derecho. En el ejemplo: la entrada de grupo sólo da $r$, así que el AND de $\{rw\} \cap \{r\} = \{r\}$ — **Pablo sólo puede leer**, aunque su entrada individual diga $rw$. Requiere además fijar un orden de evaluación de los ACLs aplicables.
- **First-Rule** — usa el **primer** ACL que encuentra, sin combinar nada. En el ejemplo, la entrada individual de Pablo aparece primero en la lista → **Pablo puede leer y escribir**.

La misma tabla de entrada da resultados **opuestos** según la política elegida — $r$ solo con Grant-All, $rw$ con First-Rule —, y eso es exactamente lo que hace que "qué política de resolución usa este sistema" sea una pregunta que hay que responder antes de poder predecir un acceso.

### Derechos por defecto

**Escenario (filmina 10).** $ACL(o) = \{(\text{Pablo}, x), (*, r)\}$, donde $*$ es el default para cualquier sujeto sin entrada explícita. Dos formas, también incompatibles:

- **Override** — si el sujeto tiene un AC propio, se usa **sólo** ése; si no, el default. Pablo tiene entrada explícita ($x$), así que el default no se aplica → **Pablo puede ejecutar**, nada más.
- **Augment** — se parte del default y se **agregan** los ACs explícitos. Pablo parte de $r$ (el default) y le suma $x$ (su entrada) → **Pablo puede leer y ejecutar**.

De nuevo, el mismo escenario da resultados distintos ($x$ solo, o $rx$) según cuál de las dos reglas rija.

## Revocación

Dos formas directas de quitar un derecho: el dueño borra la entrada del sujeto entera, o borra sólo los derechos necesarios dentro de ella. El problema aparece **con la transferencia**: revocar se complica cuando hubo delegación, porque puede requerir borrar en cascada los permisos delegados a partir del sujeto revocado.

**Escenario trampa (filmina 11), desarrollado.** $S_1$ delega en $S_2$; $S_2$ delega, a su vez, en $S_3$. Después, $S_1$ revoca a $S_2$. Y **acto seguido**, $S_3$ —que todavía conserva el permiso que $S_2$ le delegó antes de ser revocado— **delega de vuelta en $S_2$**.

$$S_1 \to S_2 \to S_3, \qquad S_1 \text{ revoca } S_2, \qquad S_3 \to S_2 \ \text{(otra vez)}$$

El sistema tiene que decidir si ese re-otorgamiento posterior **sobrevive** a la revocación en cascada o no. Las dos respuestas son defendibles y ninguna es obviamente correcta: si $S_3$ obtuvo su permiso de $S_2$ **antes** de que $S_2$ fuera revocado, y $S_1$ nunca revocó a $S_3$, ¿por qué $S_3$ no podría delegar lo que legítimamente tiene? Pero si se permite, la revocación de $S_1$ sobre $S_2$ queda vacía de efecto en la práctica —$S_2$ recupera el acceso por la puerta de atrás en el mismo instante—. El deck no resuelve el dilema, sólo lo plantea como el motivo de que *"con transferencia de permisos, la revocación es mucho más compleja"*.

## Ejemplo desarrollado: Windows sobre archivos

*Filminas 12-13.* Derechos: leer, escribir, ejecutar, borrar, cambiar permisos, tomar control. Cada ACL incluye usuarios **y** grupos, y cada derecho tiene **tres** estados posibles por entrada — no dos:

$$\text{otorgado } (+), \qquad \text{no asignado (en blanco)}, \qquad \text{revocado } (-)$$

Los derechos vienen agrupados en niveles predefinidos: *No access* (todos en $-$), *Read* (leer $+$, ejecutar $+$), *Change* (leer, escribir, ejecutar, borrar, todos $+$), *Full control* (todos en $+$).

**Algoritmo de acceso (filmina 13), como cadena de decisión:**

$$\begin{aligned}
&\text{1. Buscar todos los ACs del ACL que referencien al usuario o a sus grupos}\\
&\text{2. Si no hay ninguno} \Rightarrow \text{denegado}\\
&\text{3. Si el acceso está \textbf{revocado} en algún AC aplicable} \Rightarrow \text{denegado}\\
&\text{4. Si al menos un AC \textbf{permite} el derecho (y ninguno lo revocó)} \Rightarrow \text{aceptado}\\
&\text{5. En cualquier otro caso} \Rightarrow \text{denegado}
\end{aligned}$$

El paso 3 es el que define el sabor del algoritmo: es una variante de **Grant-All con veto explícito** *(lectura nuestra: la filmina 13 da los cinco pasos, no esta caracterización)* — el $-$ de cualquier AC aplicable gana **siempre**, sin importar cuántos $+$ haya en los demás. Un usuario puede tener $+$ por pertenecer a un grupo con acceso `Full control` y aun así quedar denegado si una sola entrada individual lo tiene en $-$: el revocado pesa más que cualquier cantidad de otorgados.

## Confirmación de que este mecanismo se dicta con Pablo

*(Cruce con video, no del deck.)* El [[video-07-principios-de-diseno-2024#Qué no cubre este video|Video 07]] —de otro cuatrimestre— trae un intercambio a 04:35 en el que Ramele le pregunta a la clase: *"la parte de control de acceso ya la vieron con Pablo, ¿no?… o todo el tema de AC[L] y lista de capacidades"*. Y el [[video-11-flujo-de-informacion|Video 11]] lo confirma desde el otro lado, a 03:28: *"las listas de control de acceso, llamadas ACLs… eso lo vemos todo en la clase de control de acceso"*. Ninguno de los dos videos desarrolla el mecanismo: son evidencia de que el tema existe como clase propia (ésta) y no tiene grabación en el canal — la misma conclusión que ya deja registrada la [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06]], en su nota introductoria sobre el docente.
