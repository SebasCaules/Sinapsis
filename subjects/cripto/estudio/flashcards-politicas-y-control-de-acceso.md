---
tipo: flashcards
titulo: Políticas y control de acceso
id: politicas-y-control-de-acceso
division: "6"
descripcion: Bell-LaPadula, Biba, muralla china, matrices y listas de control de acceso, OAuth 2 y OpenID Connect.
---

## ¿Qué es una política de seguridad, qué es un sistema seguro y qué es una violación de seguridad? {#politicas-y-control-de-acceso:politica-y-sistema-seguro}
> pagina: politica-de-seguridad-y-sistema-seguro

$$
\textbf{Política: } \text{enunciado que parte los estados de un sistema en autorizados (seguros) y no autorizados}
$$

$$
\textbf{Sistema seguro: } \text{comienza en un estado autorizado y nunca puede entrar en uno no autorizado}
$$

$$
\textbf{Violación de seguridad: } \text{transición del sistema hacia un estado no autorizado}
$$

La política es una **partición estática** del espacio de estados; "sistema seguro" es una propiedad **dinámica**, sobre todas las trayectorias posibles. La definición de violación no exige intención ni adversario: cuenta igual si la provoca un ataque, un error de configuración o un bug.

## ¿Cómo se definen confidencialidad, integridad y disponibilidad, y qué las distingue entre sí? {#politicas-y-control-de-acceso:triada-cid}
> pagina: confidencialidad-integridad-y-disponibilidad

Con $X$ un conjunto de entidades e $I$ una información o recurso:

$$
\begin{aligned}
&\textbf{Confidencialidad: } \text{ningún miembro de } X \text{ puede obtener información de } I\\
&\textbf{Integridad: } \text{todo miembro de } X \text{ confía en } I\\
&\textbf{Disponibilidad: } \text{todo miembro de } X \text{ puede acceder a } I \text{ cuando lo requiere}
\end{aligned}
$$

Difieren en el **cuantificador** (ningún / todo) y en la **relación** (obtener información / confiar / acceder). Son tres ejes ortogonales, no una escala. La confidencialidad exige además "ni siquiera por vías indirectas": tampoco se debe poder **inferir** $I$ combinando otros accesos.

## ¿Qué distingue el acceso discrecional (DAC) del mandatorio (MAC)? {#politicas-y-control-de-acceso:dac-versus-mac}
> pagina: paradigmas-de-control-de-acceso

$$
\begin{array}{l|l|l}
 & \text{Discrecional (DAC)} & \text{Mandatorio (MAC)}\\ \hline
\text{Reglas} & \text{Arbitrarias (ad hoc)} & \text{Prefijadas}\\
\text{Mecanismos} & \text{Puntuales} & \text{Del sistema}\\
\text{¿Se pueden alterar?} & \text{Sí, opcionalmente} & \text{No}
\end{array}
$$

En DAC, quien **crea** la información puede controlar el acceso a ella; en MAC las reglas las fija el sistema y ningún sujeto puede alterarlas. No son excluyentes: Bell-LaPadula los combina, con la regla de que *"los accesos discrecionales solo pueden restringir a los mandatorios, no contradecirlos"*.

## ¿Qué diferencia a un lenguaje de descripción de políticas cerrado de uno abierto? {#politicas-y-control-de-acceso:lenguajes-cerrado-versus-abierto}
> pagina: lenguajes-de-descripcion-de-politicas

**Cerrado** (*deny by default*): lista qué se **permite**; todo lo no mencionado queda prohibido. Es el más restrictivo por omisión, y el mismo principio que después adoptan ACLs y capacidades.

**Abierto** (*allow by default*): lista qué **no** se permite; lo no mencionado está permitido, como en las reglas `deny (op X) when b` del ejemplo del navegador.

Los dos son lenguajes de **alto nivel** (precisos, declarativos). Los de **bajo nivel** son imperativos: comandos que definen o verifican restricciones, como `xhost` o Tripwire. La sección cierra con la advertencia de no confundir políticas con mecanismos.

## Enuncie la condición de seguridad simple y la condición de cierre de Bell-LaPadula {#politicas-y-control-de-acceso:blp-dos-condiciones}
> pagina: bell-lapadula

Con niveles totalmente ordenados ($\mathsf{Public} < \mathsf{Confidential} < \mathsf{Secret} < \mathsf{Top\ Secret}$) y $L(\cdot)$ la función de etiquetado:

$$
\textbf{Simple: } S \text{ puede leer } O \iff L(O) \le L(S) \ \wedge\ S \text{ tiene permiso discrecional de lectura}
$$

$$
\textbf{Cierre (*-property): } S \text{ puede escribir } O \iff L(S) \le L(O) \ \wedge\ S \text{ tiene permiso discrecional de escritura}
$$

Resumen: **la información fluye hacia arriba, no hacia abajo** — se lee hacia abajo o al mismo nivel, se escribe hacia arriba o al mismo nivel. La condición de nivel es MAC; el permiso discrecional es DAC. A mayor nivel del sujeto, más puede leer y menos puede escribir.

## ¿Qué afirma el Teorema básico de la seguridad y por qué no alcanza con la condición simple? {#politicas-y-control-de-acceso:blp-teorema-basico}
> pagina: bell-lapadula

$$
\textbf{Teorema básico: } \text{si el sistema arranca en un estado seguro y cada transición satisface la condición simple y la de cierre, todos los estados son seguros}
$$

La condición simple sólo impide la **lectura directa** hacia arriba. Sin la condición de cierre, un sujeto de nivel alto podría leer un secreto (lectura permitida) y luego **escribirlo** en un objeto de nivel bajo, filtrándolo por un canal indirecto que elude por completo la restricción de lectura.

El **principio de tranquilidad** —usuarios y objetos no cambian de nivel después de creados— es la hipótesis que sostiene el teorema: subir el nivel de un objeto viola retroactivamente la condición simple, y bajarlo (declasificación) viola la de cierre.

## ¿Cómo se define la dominancia entre compartimentos y por qué es un orden parcial? {#politicas-y-control-de-acceso:blp-dominancia}
> pagina: bell-lapadula

Un **compartimento** es $(\text{Nivel}, \{\text{categorías}\})$, donde las categorías describen el tipo de información y **no están ordenadas** entre sí. Con $l \in L$ y $C \subseteq CAT$:

$$
(l, C)\ \operatorname{dom}\ (l', C') \iff l' \le l \ \wedge\ C' \subseteq C
$$

Es un orden **parcial**: si ninguno de los dos conjuntos de categorías incluye al otro, los compartimentos no se dominan en ninguna dirección, sin importar los niveles —$(\mathsf{S},\{X\}) \not\operatorname{dom} (\mathsf{P},\{Y\})$ y tampoco al revés—, y eso es exactamente lo que aísla proyectos entre sí, algo que un orden total de niveles no puede lograr. Las condiciones se reescriben con $\operatorname{dom}$ en vez de $\le$: leer si $L(S) \operatorname{dom} L(O)$, escribir si $L(O) \operatorname{dom} L(S)$.

## ¿Cuáles son las tres reglas de Strict Integrity (Biba) y qué invierten de Bell-LaPadula? {#politicas-y-control-de-acceso:biba-strict-integrity}
> pagina: modelos-de-integridad-de-biba

$$
\begin{aligned}
&\text{1. } s \text{ puede leer } o \iff i(s) \le i(o)\\
&\text{2. } s \text{ puede escribir } o \iff i(o) \le i(s)\\
&\text{3. } s_1 \text{ puede ejecutar } s_2 \iff i(s_2) \le i(s_1)
\end{aligned}
$$

Se lee: **"no se puede leer hacia abajo, no se puede escribir hacia arriba"**, exactamente invertido respecto de BLP. La razón: acá se protege que **la basura no suba**, no que el secreto no baje. Los niveles de seguridad limitan el **flujo** de información; los de integridad limitan la **modificación**.

## ¿Cuál es la regla propia de Low-Water-Mark y cuál es su precio? {#politicas-y-control-de-acceso:biba-low-water-mark}
> pagina: modelos-de-integridad-de-biba

$$
\begin{aligned}
&\text{1. } s \text{ puede escribir } o \iff i(o) \le i(s)\\
&\text{2. Si } s \text{ lee } o: \quad i'(s) = \min\bigl(i(s), i(o)\bigr)\\
&\text{3. } s_1 \text{ puede ejecutar } s_2 \iff i(s_2) \le i(s_1)
\end{aligned}
$$

La regla 2 le da el nombre: el nivel del sujeto **no es fijo**, baja (nunca sube) al leer algo de menor confianza, de modo que después no puede escribir nada de nivel alto. El precio: los niveles **decaen con el uso** y eventualmente nadie puede generar objetos de nivel alto. Ring Policy, en cambio, deja la lectura libre y sin costo, con niveles estáticos.

## Enuncie la condición simple de seguridad de la muralla china {#politicas-y-control-de-acceso:muralla-china-condicion-simple}
> pagina: muralla-china

$S$ puede leer $o$ si se cumple **alguna** de las tres:

$$
\begin{aligned}
&\text{1. } \exists\, o' \text{ leído previamente por } S \text{ con } CD(o) = CD(o')\\
&\text{2. } \forall\, o' \text{ leído previamente por } S: \ COI(o) \ne COI(o')\\
&\text{3. } o \text{ es un objeto declasificado}
\end{aligned}
$$

Un **CD** (*Company Dataset*) agrupa los objetos de una misma empresa; un **COI** contiene los CD de empresas en conflicto de interés, y cada objeto pertenece a exactamente un COI. Es el **elemento temporal**: leer un CD de un COI cierra para siempre los demás CD de ese COI. El historial de accesos forma parte de la decisión, algo que Bell-LaPadula no tiene.

## ¿Qué exige la propiedad de cierre de la muralla china y qué canal cierra? {#politicas-y-control-de-acceso:muralla-china-propiedad-de-cierre}
> pagina: muralla-china

$S$ puede escribir $o$ si se cumplen **las dos**:

$$
\begin{aligned}
&\text{1. } S \text{ puede leer } o \text{ según la condición simple de seguridad}\\
&\text{2. Para todo objeto no público } o': \ S \text{ puede leer } o' \implies CD(o') = CD(o)
\end{aligned}
$$

Es decir: si $S$ tiene lectura sobre más de una empresa, **no puede escribir nada**. Cierra el canal indirecto vía un CD compartido: $s_1$ escribe en un CD neutral algo que refleja lo que sabe de su empresa y $s_2$, que también lo lee, se entera de información de la competencia sin haber leído nunca el CD original.

## ¿Qué dicen los principios de autonomía y de seguridad al componer políticas, y qué pasa con los huecos? {#politicas-y-control-de-acceso:composicion-autonomia-y-seguridad}
> pagina: composicion-de-politicas

$$
\textbf{Autonomía: } \text{todo acceso permitido por algún componente debe seguir permitido en la política emergente}
$$

$$
\textbf{Seguridad: } \text{todo acceso prohibido por algún componente debe seguir prohibido en la política emergente}
$$

La composición adoptada hereda **todas** las prohibiciones. Para los accesos que ninguna política original menciona hay dos salidas incompatibles: permitirlos (modelo de Gong y Qian) o prohibirlos (denegación por defecto). El resultado es una **política nueva**, no la suma de las dos, y determinar el número mínimo de relaciones a quitar para que quede consistente es, en general, un problema NP.

## ¿Qué es la matriz de control de acceso y por qué no se implementa tal cual? {#politicas-y-control-de-acceso:matriz-de-acceso-y-proyecciones}
> pagina: matriz-de-control-de-acceso

Una fila por sujeto, una columna por objeto y las acciones permitidas en la intersección:

$$
M: S \times O \to 2^{R}
$$

Permite implementar **cualquier** política, pero escala muy mal: $100\,000 \times 500 = 50\,000\,000$ de entradas, casi todas vacías. De ahí sus debilidades: desperdicio de espacio, altas y bajas costosas y administración elemento a elemento.

Se implementan sus dos **proyecciones**: por columna, las **ACLs** (*¿quién puede acceder a este objeto?*); por fila, las **listas de capacidades** (*¿a qué puede acceder este sujeto?*).

## Defina $ACL(o)$ y la regla que cierra la definición {#politicas-y-control-de-acceso:acl-definicion}
> pagina: listas-de-control-de-acceso

$$
ACL(o) = \{(s_i, r_i) \mid s_i \in S,\ r_i \subseteq R\}
$$

**Si un sujeto no tiene entrada en $ACL(o)$, no tiene ningún derecho sobre $o$**: principio de denegar por defecto.

Dos formas distintas de usuario privilegiado: `root` en Linux está **exento de todo ACL** (el sistema ni lo consulta); `administrator` en Windows 200x tiene `take ownership` sobre todos los objetos, pero **sigue siendo una entrada de ACL**.

## Con $ACL(o)=\{(\text{Pablo}, rw), (\text{Profesores}, r)\}$ y Pablo en Profesores, ¿qué puede hacer Pablo? {#politicas-y-control-de-acceso:acl-grant-all-versus-first-rule}
> pagina: listas-de-control-de-acceso

Depende de la política de resolución de conflictos, y las dos dan resultados **opuestos**:

- **Grant-All** — exige que **todos** los ACs aplicables otorguen el derecho: $\{rw\} \cap \{r\} = \{r\}$, así que Pablo **sólo puede leer**. Requiere además fijar un orden de evaluación.
- **First-Rule** — usa el **primer** AC que encuentra, sin combinar: la entrada individual aparece primero, así que Pablo **puede leer y escribir**.

La misma disyuntiva reaparece con los derechos por defecto: **Override** usa sólo el AC propio si existe, **Augment** parte del default y le suma los ACs explícitos.

## ¿Qué es $CAP(s)$ y en qué se diferencia de fondo de un ACL? {#politicas-y-control-de-acceso:capacidades-frente-a-acl}
> pagina: listas-de-capacidades

$$
CAP(s) = \{(o_i, r_i) \mid o_i \in O,\ r_i \subseteq R\}
$$

Es la proyección por **filas**, con el mismo denegar por defecto. La diferencia: una capacidad **se posee** —quien la tiene, tiene el acceso—, en vez de ser un registro que el sistema consulta. Por eso el sistema no controla ese dato y hacen falta protecciones explícitas contra **alterar** o **crear** capacidades: tags de hardware, segmentos de sólo lectura con acceso indirecto (los descriptores de archivo de Linux) o un hash criptográfico con una clave que sólo conoce el sistema.

Revocar recorriendo todas las listas es inviable (imposible en sistemas remotos), así que se usa **indirección**: la capacidad es un índice a una tabla invisible para los procesos, y revocar es invalidar esa entrada.

## ¿Qué agrega un ACL propagable (PACL) y cuáles son sus cuatro reglas? {#politicas-y-control-de-acceso:pacl-cuatro-reglas}
> pagina: acls-propagables

El control de acceso **sigue a la información, no al objeto**: copiar el contenido a un objeto nuevo no libera de la restricción original.

$$
\begin{aligned}
&\text{Si } s_i \text{ crea } o: &&PACL(o) = PACL_{s_i}\\
&\text{Si } s_i \text{ modifica } o: &&PACL(o) \leftarrow PACL_{s_i} \cap PACL(o)\\
&\text{Si } s_i \text{ lee } o: &&PACL'_{s_i} = PACL_{s_i} \cap PACL(o)\\
&\text{Si } s_i \text{ escribe } o: &&PACL'(o) = PACL(o) \cap PACL_{s_i}
\end{aligned}
$$

Las cuatro **intersecan**: ningún PACL se amplía nunca. Leer degrada el PACL del lector, igual que Low-Water-Mark degrada el nivel del sujeto — la propia filmina lo llama una implementación casi directa de una política de integridad de Biba.

## ¿Qué garantiza un esquema $(t,n)$-threshold y cómo se construye por el método de Shamir? {#politicas-y-control-de-acceso:shamir-esquema-umbral}
> pagina: secretos-compartidos-y-metodo-de-shamir

Reparte un secreto en $n$ sombras tales que **cualesquiera $t$** lo reconstruyen y **cualesquiera $k<t$** no dan ninguna información sobre él. Es una implementación de separación de privilegios.

$$
P(x) = a_{t-1}x^{t-1} + \cdots + a_1 x + a_0 \pmod p, \qquad a_0 = s, \quad p \text{ primo con } p>s,\ p>n
$$

Las sombras son $P(1), \dots, P(n)$. Se reconstruye por interpolación de Lagrange y se evalúa en $x=0$, porque $P(0)=a_0=s$:

$$
P(x) = \sum_{a=1}^{t} s_{i_a} \prod_{\substack{b=1\\ b \ne a}}^{t} \frac{x - i_b}{i_a - i_b} \pmod p
$$

La relación correcta es $\text{grado} = t-1$: **$t$ puntos determinan un polinomio de grado $t-1$**.

## ¿Por qué interceptar la URL de redirección de OAuth 2.0 no alcanza para robar el access token? {#politicas-y-control-de-acceso:oauth-codigo-versus-access-token}
> pagina: oauth-2

El **código de autorización** viaja por el navegador, expuesto en la URL de redirección (pasos 4-5 del baile). Pero el intercambio de ese código por el **access token** (pasos 6-7) es un canal **servidor a servidor** que además exige el `client secret`, y ese secreto nunca pasa por el navegador.

Los cuatro roles son Resource Owner, Client Application, Resource Server y Authorization Server; la aplicación **nunca ve la contraseña** del dueño del recurso. El registro previo del cliente fija `client id`, `client secret` (sólo para clientes confidenciales) y las `redirect URI` válidas.

Por eso **Authorization Code** es la opción segura del cliente confidencial, mientras que **Implicit** —que devuelve el token directamente, sin código— es la concesión a un cliente público, que no puede guardar un secreto.

## ¿Qué le agrega OpenID Connect a OAuth 2.0 y qué es el `id_token`? {#politicas-y-control-de-acceso:oidc-id-token-y-claims}
> pagina: openid-connect-y-jwt

OAuth resuelve **autorización** y no dice **quién** es el usuario. OIDC se construye encima y agrega **autenticación**, con un *bearer token* llamado `id_token` que se obtiene junto con el access token, codificado en Base64 URL-safe.

Ese `id_token` **es un JWT**: un documento JSON firmado por el proveedor de identidad, en tres partes `header.payload.signature`.

Sus claims: `sub` (a quién identifica), `iss` (quién lo emitió), `aud` (para quién es), `nonce` (contra *replay*), `auth_time` (cuándo se autenticó), `acr` (cómo, opcional), `iat` (cuándo se emitió) y `exp` (cuándo vence). Primero autenticar, después autorizar: son preguntas distintas.
