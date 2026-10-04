---
tipo: guia
unidad: 1
orden: 2
tema: Creación de esquemas — CREATE TABLE y tipos de datos
resumen: "TP2 resuelto: los CREATE TABLE de los tres ejercicios (artículos y palabras, productos químicos y envíos, y los tres DERE del TP1), con PK, NOT NULL, UNIQUE, CHECK y FK, todos corridos en MySQL 9.7.2."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 2 Creates.pdf"
  - "raw/Unidad-01/Practica/ITBA TP 1 Modelos_Diagramas.pdf"
estado: procesado
---

# Guía TP02 — Creación de esquemas: tablas y tipos de datos

## Resumen general

El TP2 es el paso del diagrama a la base: se toma un DERE y se escribe el script `CREATE TABLE` que lo
implementa con claves primarias, restricciones de nulidad e integridad referencial. Son tres
ejercicios: un modelo chico con los tipos de datos dados (artículos y palabras), un DERE con jerarquía,
relación unaria N:N y autorrelación 1:N (productos químicos, envíos y clientes), y los tres DERE del TP1
llevados a tablas.

Se necesita la chuleta de derivación de la [[Clase 03 - Derivación a Esquema Lógico|Clase 03]]: una
entidad es una tabla; el identificador principal (bolita llena) es la `PRIMARY KEY`; el identificador
alternativo (bolita a medias) es `UNIQUE NOT NULL`; línea continua es `NOT NULL` y punteada es opcional;
el atributo compuesto se despliega en sus partes y el multivaluado va a otra tabla. En una 1:N la clave
del lado 1 pasa como FK al lado N (renombrada si es unaria); una N:N es una tabla nueva con clave
yuxtapuesta; una jerarquía exclusiva lleva discriminador en el supertipo.

Trampas: las cardinalidades se leen **look-across** (el par pegado a una entidad dice cuántas de ella
corresponden a una de la otra); una FK compuesta referencia las dos columnas juntas; las FK circulares
(departamento ↔ jefe) obligan a crear las tablas primero y las FK después con `ALTER TABLE`, y una de
las dos columnas tiene que admitir `NULL` porque MySQL no tiene restricciones diferidas. `INT(4)` está
deprecado en MySQL 8+: para respetar el tamaño se usa `NUMERIC(4)`.

Para el parcial: el patrón "tablas con PK en el `CREATE`, cada FK en su propio `ALTER TABLE`" y saber
justificar cada `NOT NULL`, `UNIQUE` y `CHECK` desde el diagrama.

## Setup

MySQL en Docker como en la [[Práctica 2026-08-04|Práctica del 04/08]]. Cada ejercicio en su propia base
para que no choquen los nombres (`cliente` y `producto` se repiten); el ejercicio 1 pide `mydb`.

```sql
CREATE DATABASE IF NOT EXISTS tp2_ej2;
CREATE DATABASE IF NOT EXISTS tp2_ej3_1;
CREATE DATABASE IF NOT EXISTS tp2_ej3_2;
CREATE DATABASE IF NOT EXISTS tp2_ej3_3;
```

## Ejercicio 1

**Consigna.** Construir y ejecutar en `mydb` el script del modelo `ARTICULO (0,N) — R1 — (0,N) PALABRA`,
con atributos, PK, nulidad e integridad referencial. R1 se llama `CONTIENE`. Tipos: E = entero,
SLV = string de longitud variable, SLF = string de longitud fija, F = fecha, D = decimal.

Lectura del diagrama: `id_articulo` (E,4) es el IP; `titulo` (SLV,120) es identificador alternativo
(bolita a medias); `autor` (SLV,30), `fecha_pub` (F) y `nacional` (SLF,10) son obligatorios (línea
continua). En `PALABRA` el IP `id_palabra` es **compuesto**: `cod_p` (E,4) + `idioma` (SLF,2);
`descrip` (SLV,25) es obligatorio. `CONTIENE` es N:N → tabla nueva.

**Resolución.**

```sql
USE mydb;

CREATE TABLE articulo (
    id_articulo NUMERIC(4)   NOT NULL,
    titulo      VARCHAR(120) NOT NULL,
    autor       VARCHAR(30)  NOT NULL,
    fecha_pub   DATE         NOT NULL,
    nacional    CHAR(10)     NOT NULL,
    CONSTRAINT pk_articulo PRIMARY KEY (id_articulo),
    CONSTRAINT ak_articulo_titulo UNIQUE (titulo)
);

CREATE TABLE palabra (
    cod_p   NUMERIC(4)  NOT NULL,
    idioma  CHAR(2)     NOT NULL,
    descrip VARCHAR(25) NOT NULL,
    CONSTRAINT pk_palabra PRIMARY KEY (cod_p, idioma)
);

CREATE TABLE contiene (
    id_articulo NUMERIC(4) NOT NULL,
    cod_p       NUMERIC(4) NOT NULL,
    idioma      CHAR(2)    NOT NULL,
    CONSTRAINT pk_contiene PRIMARY KEY (id_articulo, cod_p, idioma)
);

ALTER TABLE contiene
    ADD CONSTRAINT fk_contiene_articulo FOREIGN KEY (id_articulo)
        REFERENCES articulo (id_articulo);
ALTER TABLE contiene
    ADD CONSTRAINT fk_contiene_palabra FOREIGN KEY (cod_p, idioma)
        REFERENCES palabra (cod_p, idioma);
```

- El IP compuesto de `PALABRA` se despliega en sus dos partes y la PK es el par; por eso la FK de
  `contiene` hacia `palabra` es **una sola FK de dos columnas**, no dos FK sueltas.
- `(E,4)` → `NUMERIC(4)`: rechaza `12345` (`ERROR 1264 Out of range`). (atención) `INT(4)` corre pero
  el ancho es solo de visualización y está deprecado desde MySQL 8.0.17: no limita a 4 dígitos.
- Verificado: un segundo artículo con el mismo `titulo` da `ERROR 1062 Duplicate entry … for key
  'articulo.ak_articulo_titulo'`; una fila de `contiene` con una palabra inexistente da `ERROR 1452`.

## Ejercicio 2

**Consigna.** Crear las tablas del DERE de productos químicos, envíos y clientes, con sus
restricciones, asumiendo los tipos más convenientes.

Lectura del diagrama (look-across):

| Constructo | Lectura | Implementación |
| --- | --- | --- |
| `PRODUCTO_QUIMICO` → `PQ_LIQUIDO` / `PQ_SOLIDO`, círculo `d`, doble línea, discriminador `tipo_pq` | jerarquía **disjunta** y **total** | una tabla por nodo con la PK del supertipo; `tipo_pq NOT NULL` con `CHECK` |
| `COMPONE` (0,N)/(1,N) con `porcentaje` | unaria **N:N** con atributo | tabla `compone` con las dos FK renombradas |
| `CONTIENE`: producto (1,1) — envío (0,N) | cada envío contiene **un** producto | FK `id_prod_quim NOT NULL` en `envio` |
| `PERTENECE`: envío (0,N) — cliente (1,1) | cada envío es de **un** cliente | FK `id_cliente NOT NULL` en `envio` |
| `ES_GARANTE`: cliente (0,1) — (0,N) | un cliente tiene a lo sumo un garante | FK unaria `id_garante` **nullable** en `cliente` |
| `CUIT` bolita a medias | identificador alternativo | `UNIQUE NOT NULL` |
| `direccion` (calle, puerta, piso) | compuesto | se despliega en tres columnas |
| `cond_traslado`, `e_mail` línea punteada | opcionales | sin `NOT NULL` |

**Resolución.**

```sql
USE tp2_ej2;

CREATE TABLE producto_quimico (
    id_prod_quim     INT          NOT NULL,
    nombre_prod_quim VARCHAR(60)  NOT NULL,
    formula          VARCHAR(100) NOT NULL,
    tipo_pq          CHAR(1)      NOT NULL,
    CONSTRAINT pk_producto_quimico PRIMARY KEY (id_prod_quim),
    CONSTRAINT ck_tipo_pq CHECK (tipo_pq IN ('L', 'S'))
);

CREATE TABLE pq_liquido (
    id_prod_quim  INT          NOT NULL,
    inflamable    BOOLEAN      NOT NULL,
    tipo_envase   VARCHAR(30)  NOT NULL,
    cond_traslado VARCHAR(100),
    CONSTRAINT pk_pq_liquido PRIMARY KEY (id_prod_quim)
);

CREATE TABLE pq_solido (
    id_prod_quim INT          NOT NULL,
    forma        VARCHAR(30)  NOT NULL,
    empaque_max  DECIMAL(8,2) NOT NULL,
    CONSTRAINT pk_pq_solido PRIMARY KEY (id_prod_quim)
);

CREATE TABLE compone (
    id_compuesto  INT          NOT NULL,
    id_componente INT          NOT NULL,
    porcentaje    DECIMAL(5,2) NOT NULL,
    CONSTRAINT pk_compone PRIMARY KEY (id_compuesto, id_componente),
    CONSTRAINT ck_compone_porcentaje CHECK (porcentaje > 0 AND porcentaje <= 100),
    CONSTRAINT ck_compone_distintos CHECK (id_compuesto <> id_componente)
);

CREATE TABLE cliente (
    id_cliente INT         NOT NULL,
    cuit       CHAR(11)    NOT NULL,
    apellido   VARCHAR(40) NOT NULL,
    nombre     VARCHAR(40) NOT NULL,
    calle      VARCHAR(60) NOT NULL,
    puerta     VARCHAR(10) NOT NULL,
    piso       VARCHAR(5)  NOT NULL,
    e_mail     VARCHAR(120),
    telefono   VARCHAR(20) NOT NULL,
    id_garante INT,
    CONSTRAINT pk_cliente PRIMARY KEY (id_cliente),
    CONSTRAINT ak_cliente_cuit UNIQUE (cuit),
    CONSTRAINT ck_cliente_garante CHECK (id_garante <> id_cliente)
);

CREATE TABLE envio (
    nro_envio    INT           NOT NULL,
    cantidad     INT           NOT NULL,
    peso         DECIMAL(10,2) NOT NULL,
    id_prod_quim INT           NOT NULL,
    id_cliente   INT           NOT NULL,
    CONSTRAINT pk_envio PRIMARY KEY (nro_envio)
);

ALTER TABLE pq_liquido ADD CONSTRAINT fk_pq_liquido_pq
    FOREIGN KEY (id_prod_quim) REFERENCES producto_quimico (id_prod_quim);
ALTER TABLE pq_solido ADD CONSTRAINT fk_pq_solido_pq
    FOREIGN KEY (id_prod_quim) REFERENCES producto_quimico (id_prod_quim);
ALTER TABLE compone ADD CONSTRAINT fk_compone_compuesto
    FOREIGN KEY (id_compuesto) REFERENCES producto_quimico (id_prod_quim);
ALTER TABLE compone ADD CONSTRAINT fk_compone_componente
    FOREIGN KEY (id_componente) REFERENCES producto_quimico (id_prod_quim);
ALTER TABLE cliente ADD CONSTRAINT fk_cliente_garante
    FOREIGN KEY (id_garante) REFERENCES cliente (id_cliente);
ALTER TABLE envio ADD CONSTRAINT fk_envio_producto
    FOREIGN KEY (id_prod_quim) REFERENCES producto_quimico (id_prod_quim);
ALTER TABLE envio ADD CONSTRAINT fk_envio_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente);
```

- Los subtipos usan como PK la clave del supertipo, que a la vez es FK hacia él. El discriminador va
  en el supertipo porque la jerarquía es **exclusiva** (`d`).
- `CONTIENE` y `PERTENECE` son 1:N y no generan tabla: la clave del lado 1 viaja a `envio`. La
  cardinalidad mínima 1 del lado 1 es lo que vuelve la FK `NOT NULL`.
- (nota) Con restricciones declarativas no se puede exigir que un producto tenga **al menos un**
  componente (el `(1,N)` de `COMPONE`) ni que cada producto esté en exactamente un subtipo (la
  totalidad de la jerarquía): eso es materia de triggers ([[Guía TP07 - Restricciones avanzadas|TP7]]).
- Verificado: `tipo_pq = 'G'`, un producto que se compone de sí mismo y `porcentaje = 150` violan sus
  `CHECK` (`ERROR 3819`); un CUIT repetido da `ERROR 1062`; un envío con producto inexistente da
  `ERROR 1452` y uno sin cliente, `ERROR 1048 Column 'id_cliente' cannot be null`.

## Ejercicio 3

**Consigna.** Crear las tablas de los DERE del TP1, con sus restricciones y los tipos más convenientes.
Los tres DERE salen del enunciado del TP1 ([[Guía TP01 - Modelos y diagramas|Guía TP01]]). Es la misma derivación a tablas de esa guía, con nombres en minúscula y `renglon_factura` en lugar de `CONTIENE`; las estructuras, claves y restricciones coinciden.

### 3.1 · Clientes, facturas y productos (TP1, ejercicio 1)

**Consigna.** Cliente (id, nombre y apellido, fecha de nacimiento, dirección, teléfono principal,
opcionalmente un teléfono alternativo y varios celulares); factura (tipo + número la identifican,
fecha, cliente, importe total, productos y cantidades); producto (código, nombre, precio). El modelo
debe respetar el precio de venta aunque cambie el precio del producto.

**Resolución.**

```sql
USE tp2_ej3_1;

CREATE TABLE cliente (
    id_cliente           INT          NOT NULL,
    nombre               VARCHAR(40)  NOT NULL,
    apellido             VARCHAR(40)  NOT NULL,
    fecha_nacimiento     DATE         NOT NULL,
    direccion            VARCHAR(120) NOT NULL,
    telefono_principal   VARCHAR(20)  NOT NULL,
    telefono_alternativo VARCHAR(20),
    CONSTRAINT pk_cliente PRIMARY KEY (id_cliente)
);

CREATE TABLE celular_cliente (
    id_cliente INT         NOT NULL,
    celular    VARCHAR(20) NOT NULL,
    CONSTRAINT pk_celular_cliente PRIMARY KEY (id_cliente, celular)
);

CREATE TABLE producto (
    codigo VARCHAR(20)   NOT NULL,
    nombre VARCHAR(60)   NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_producto PRIMARY KEY (codigo),
    CONSTRAINT ck_producto_precio CHECK (precio >= 0)
);

CREATE TABLE factura (
    tipo          CHAR(1)       NOT NULL,
    numero        INT           NOT NULL,
    fecha         DATE          NOT NULL,
    importe_total DECIMAL(12,2) NOT NULL,
    id_cliente    INT           NOT NULL,
    CONSTRAINT pk_factura PRIMARY KEY (tipo, numero),
    CONSTRAINT ck_factura_tipo CHECK (tipo IN ('A', 'B', 'C'))
);

CREATE TABLE renglon_factura (
    tipo            CHAR(1)       NOT NULL,
    numero          INT           NOT NULL,
    codigo_producto VARCHAR(20)   NOT NULL,
    cantidad        INT           NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_renglon_factura PRIMARY KEY (tipo, numero, codigo_producto),
    CONSTRAINT ck_renglon_cantidad CHECK (cantidad > 0)
);

ALTER TABLE celular_cliente ADD CONSTRAINT fk_celular_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente);
ALTER TABLE factura ADD CONSTRAINT fk_factura_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente);
ALTER TABLE renglon_factura ADD CONSTRAINT fk_renglon_factura
    FOREIGN KEY (tipo, numero) REFERENCES factura (tipo, numero);
ALTER TABLE renglon_factura ADD CONSTRAINT fk_renglon_producto
    FOREIGN KEY (codigo_producto) REFERENCES producto (codigo);
```

- **Cliente ↔ factura:** la factura guarda solo `id_cliente` (FK), no el nombre; un cliente tiene
  muchas facturas porque la FK está del lado N.
- **Celulares:** atributo multivaluado → tabla aparte `celular_cliente`. El alternativo es uno solo y
  opcional → columna nullable.
- **Precio histórico:** `renglon_factura.precio_unitario` copia el precio **al momento de la venta**.
  Verificado: tras `UPDATE producto SET precio = 150`, el renglón sigue en `100.00` y el producto en
  `150.00`. Sin esa columna, recalcular una factura vieja con `producto.precio` daría otro importe.
- `factura` con el mismo par `(tipo, numero)` da `ERROR 1062 Duplicate entry 'A-1'`.

### 3.2 · Depósito: departamentos, empleados, productos y fabricantes (TP1, ejercicio 2)

**Consigna.** Empleado (número; nombre, apellido, dirección con calle, puerta, piso y ciudad;
departamento al que pertenece). Departamento (lo identifica el nombre; sus empleados, su jefe —un
empleado es jefe de un solo departamento— y los productos que vende). Producto (nombre, fabricante,
precio de venta; se identifica por el número del fabricante o por el número del depósito). Fabricante
(lo identifica el nombre; dirección, productos que suministra y sus precios).

**Resolución.**

```sql
USE tp2_ej3_2;

CREATE TABLE departamento (
    nombre  VARCHAR(40) NOT NULL,
    id_jefe INT,
    CONSTRAINT pk_departamento PRIMARY KEY (nombre),
    CONSTRAINT ak_departamento_jefe UNIQUE (id_jefe)
);

CREATE TABLE empleado (
    nro_empleado        INT         NOT NULL,
    nombre              VARCHAR(40) NOT NULL,
    apellido            VARCHAR(40) NOT NULL,
    calle               VARCHAR(60) NOT NULL,
    puerta              VARCHAR(10) NOT NULL,
    piso                VARCHAR(5),
    ciudad              VARCHAR(60) NOT NULL,
    nombre_departamento VARCHAR(40) NOT NULL,
    CONSTRAINT pk_empleado PRIMARY KEY (nro_empleado)
);

CREATE TABLE fabricante (
    nombre    VARCHAR(60)  NOT NULL,
    direccion VARCHAR(120) NOT NULL,
    CONSTRAINT pk_fabricante PRIMARY KEY (nombre)
);

CREATE TABLE producto (
    nro_deposito      INT           NOT NULL,
    nombre_fabricante VARCHAR(60)   NOT NULL,
    nro_fabricante    VARCHAR(30)   NOT NULL,
    nombre            VARCHAR(60)   NOT NULL,
    precio_venta      DECIMAL(10,2) NOT NULL,
    precio_fabricante DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_producto PRIMARY KEY (nro_deposito),
    CONSTRAINT ak_producto_fabricante UNIQUE (nombre_fabricante, nro_fabricante)
);

CREATE TABLE vende (
    nombre_departamento VARCHAR(40) NOT NULL,
    nro_producto        INT         NOT NULL,
    CONSTRAINT pk_vende PRIMARY KEY (nombre_departamento, nro_producto)
);

ALTER TABLE empleado ADD CONSTRAINT fk_empleado_departamento
    FOREIGN KEY (nombre_departamento) REFERENCES departamento (nombre);
ALTER TABLE departamento ADD CONSTRAINT fk_departamento_jefe
    FOREIGN KEY (id_jefe) REFERENCES empleado (nro_empleado);
ALTER TABLE producto ADD CONSTRAINT fk_producto_fabricante
    FOREIGN KEY (nombre_fabricante) REFERENCES fabricante (nombre);
ALTER TABLE vende ADD CONSTRAINT fk_vende_departamento
    FOREIGN KEY (nombre_departamento) REFERENCES departamento (nombre);
ALTER TABLE vende ADD CONSTRAINT fk_vende_producto
    FOREIGN KEY (nro_producto) REFERENCES producto (nro_deposito);
```

- **Jefe:** relación 1:1 departamento–empleado → FK `id_jefe` en `departamento` con `UNIQUE` (un
  empleado jefea un solo departamento). Verificado: asignar el mismo jefe a dos departamentos da
  `ERROR 1062 … for key 'departamento.ak_departamento_jefe'`.
- (atención) `empleado → departamento` y `departamento → empleado` forman un **ciclo de FK**: por eso
  todas las FK van en `ALTER TABLE` al final, e `id_jefe` admite `NULL` para poder cargar el
  departamento antes que su jefe (MySQL no tiene restricciones diferidas). Orden de carga: departamento
  sin jefe → empleados → `UPDATE departamento SET id_jefe = …`.
- **Dos identificadores del producto:** `nro_deposito` es la PK y el número del fabricante es
  identificador alternativo, único **dentro de cada fabricante** → `UNIQUE (nombre_fabricante,
  nro_fabricante)`.
- El precio que cobra el fabricante (`precio_fabricante`) va en `producto` porque cada producto tiene un
  solo fabricante; `vende` es la N:N departamento–producto.

### 3.3 · Transportes: camioneros, paquetes, ciudades y camiones (TP1, ejercicio 3)

**Consigna.** Camionero (DNI, nombre, teléfono, dirección, salario, ciudad en la que vive); paquete
(código, descripción, destinatario, dirección del destinatario; lo reparte un solo camionero y llega a
una sola ciudad); ciudad (código, nombre); camión (matrícula, modelo, tipo, potencia). Un camionero
conduce distintos camiones en fechas distintas y un camión lo conducen varios camioneros.

**Resolución.**

```sql
USE tp2_ej3_3;

CREATE TABLE ciudad (
    codigo INT         NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    CONSTRAINT pk_ciudad PRIMARY KEY (codigo)
);

CREATE TABLE camionero (
    dni           CHAR(8)       NOT NULL,
    nombre        VARCHAR(60)   NOT NULL,
    telefono      VARCHAR(20)   NOT NULL,
    direccion     VARCHAR(120)  NOT NULL,
    salario       DECIMAL(10,2) NOT NULL,
    codigo_ciudad INT           NOT NULL,
    CONSTRAINT pk_camionero PRIMARY KEY (dni)
);

CREATE TABLE paquete (
    codigo                 INT          NOT NULL,
    descripcion            VARCHAR(120) NOT NULL,
    destinatario           VARCHAR(60)  NOT NULL,
    direccion_destinatario VARCHAR(120) NOT NULL,
    dni_camionero          CHAR(8)      NOT NULL,
    codigo_ciudad          INT          NOT NULL,
    CONSTRAINT pk_paquete PRIMARY KEY (codigo)
);

CREATE TABLE camion (
    matricula VARCHAR(10) NOT NULL,
    modelo    VARCHAR(40) NOT NULL,
    tipo      VARCHAR(30) NOT NULL,
    potencia  INT         NOT NULL,
    CONSTRAINT pk_camion PRIMARY KEY (matricula)
);

CREATE TABLE conduce (
    dni       CHAR(8)     NOT NULL,
    matricula VARCHAR(10) NOT NULL,
    fecha     DATE        NOT NULL,
    CONSTRAINT pk_conduce PRIMARY KEY (dni, matricula, fecha)
);

ALTER TABLE camionero ADD CONSTRAINT fk_camionero_ciudad
    FOREIGN KEY (codigo_ciudad) REFERENCES ciudad (codigo);
ALTER TABLE paquete ADD CONSTRAINT fk_paquete_camionero
    FOREIGN KEY (dni_camionero) REFERENCES camionero (dni);
ALTER TABLE paquete ADD CONSTRAINT fk_paquete_ciudad
    FOREIGN KEY (codigo_ciudad) REFERENCES ciudad (codigo);
ALTER TABLE conduce ADD CONSTRAINT fk_conduce_camionero
    FOREIGN KEY (dni) REFERENCES camionero (dni);
ALTER TABLE conduce ADD CONSTRAINT fk_conduce_camion
    FOREIGN KEY (matricula) REFERENCES camion (matricula);
```

- Las dos 1:N del paquete (camionero, ciudad destino) son FK `NOT NULL` en `paquete`.
- `conduce` es la N:N camionero–camión con atributo `fecha`; la fecha entra en la PK para que el mismo
  camionero pueda manejar el mismo camión en días distintos. Verificado: dos filas con fechas
  distintas entran; repetir `(dni, matricula, fecha)` da `ERROR 1062`.
- La ciudad donde vive el camionero se modela como FK a `ciudad` (reutiliza la entidad); si el TP1 la
  dejó como atributo de texto, basta un `VARCHAR`.

## Enlaces

- Práctica donde se dio el TP: [[Práctica 2026-08-04|Práctica del 04/08]]
- Reglas de derivación: [[Clase 03 - Derivación a Esquema Lógico|Clase 03 — Derivación a esquema lógico]] ·
  DDL y `ALTER TABLE`: [[Clase 04 - AlteraciónActualizaciónTablas|Clase 04 — Alteración de tablas]] ·
  [[1.03.02 - DDL — creación y alteración de tablas|DDL — creación y alteración de tablas]]
- DERE de partida del ejercicio 3: [[Guía TP01 - Modelos y diagramas|Guía TP01]]
- Motor: [[MySQL]]
