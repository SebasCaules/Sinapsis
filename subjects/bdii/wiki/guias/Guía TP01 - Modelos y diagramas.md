---
tipo: guia
unidad: 1
orden: 1
tema: Modelo/Diagrama de Entidades y Relaciones Extendido (MERE/DERE)
resumen: "TP 1 resuelto: los tres DERE (clientes y facturas, depósito, transportes) en la notación de la cátedra, con cardinalidades look-across, y su derivación a tablas, PK y FK en SQL de MySQL."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 1 Modelos_Diagramas.pdf"
  - "raw/Unidad-01/Practica/Resoluciones/TP1.md"
estado: procesado
---

# Guía TP01 — Modelos y diagramas (MERE/DERE)

## Resumen general

El TP 1 pide construir tres Diagramas de Entidades y Relaciones Extendidos a partir de un enunciado en
lenguaje natural: un sistema de clientes que compran productos con facturas, un depósito con
empleados, departamentos, productos y fabricantes, y una empresa de transportes que reparte paquetes.
Es la práctica directa de la [[Clase 02 - Modelo Entidad-Relacion|Clase 02]] (constructos del MER) y,
para la derivación a tablas, de la [[Clase 03 - Derivación a Esquema Lógico|Clase 03]].

Se necesita la notación de la cátedra: rectángulo para la entidad, rombo para la relación, bolita
rellena para el identificador principal, media bolita para el alternativo, línea punteada para el
atributo opcional, pata de gallo para el multivaluado y atributos compuestos con sus componentes
colgando. Las cardinalidades `(mín,máx)` se leen **look-across**: el par pegado a una entidad cuenta
cuántos ejemplares de *esa* entidad hay por cada ejemplar de la otra.

Las trampas: el teléfono celular "varios" es multivaluado y opcional; el identificador de la factura
es compuesto (tipo + número); el precio de venta debe guardarse en la relación factura–producto, o un
cambio de precio reescribe las facturas viejas; el número de producto del fabricante solo es único
junto con el fabricante; la relación "jefe de" es 1:1 y convive con "trabaja en"; y en la relación
camionero–camión con fecha, la fecha entra en la clave, o el mismo chofer no podría repetir camión.

Qué llevarse al parcial: identificar primero entidades, después relaciones y al final atributos;
marcar cada atributo en sus cinco ejes; justificar cada `(mín,máx)` con una frase del enunciado; y
saber bajar el diagrama a tablas con la receta de la Clase 03.

Todo el SQL de esta página corrió en MySQL 9.7.2 (inserciones de prueba incluidas).

## Ejercicio 1 — Clientes, facturas y productos

### 1.a DERE

**Consigna.** DERE para clientes (identificador, nombre y apellido, fecha de nacimiento, dirección,
teléfono principal; opcionalmente un teléfono alternativo y varios celulares), facturas (tipo y número
como identificador, fecha, cliente, importe total, productos con sus cantidades) y productos (código,
nombre, precio).

**Resolución.**

![DERE del ejercicio 1](../assets/guia-tp01-ej1.png)

| Elemento | Decisión | Por qué |
| --- | --- | --- |
| `CLIENTE.IdCliente` | IP | "un identificador" |
| `TelefonoAlternativo` | opcional, univaluado | "opcionalmente… un segundo número" |
| `Celulares` | opcional, **multivaluado** | "varios números de teléfono celular" |
| `FACTURA.IdFactura` | IP **compuesto** (`Tipo`, `Numero`) | "tipo y número (que identifica a cada factura)" |
| `ImporteTotal` | derivado (suma de cantidad × precio de cada renglón) | se puede calcular; se guarda igual porque el enunciado lo pide |
| `EMITIDA_A` | 1:N, `CLIENTE (1,1)` · `FACTURA (0,N)` | cada factura es de un único cliente; un cliente puede tener 0 o muchas facturas |
| `CONTIENE` | N:N, `FACTURA (0,N)` · `PRODUCTO (1,N)` | una factura tiene al menos un producto; un producto puede no haberse vendido nunca |
| `Cantidad`, `PrecioUnitario` | atributos de `CONTIENE` | dependen del par factura–producto, no de uno solo |

### 1.b ¿Cómo asociar clientes y facturas sin guardar el nombre en la factura?

**Consigna.** Asociar cliente y factura sin repetir el nombre de la persona (un cliente tiene muchas
facturas).

**Resolución.** Con la relación 1:N `EMITIDA_A`. Al derivar, la clave del lado 1 (`IdCliente`) pasa
como **FK** a la tabla del lado N (`FACTURA`). La factura guarda solo `IdCliente`; nombre y apellido
se obtienen con un `JOIN` contra `CLIENTE`, y viven en un único lugar (sin redundancia ni anomalías
de actualización).

### 1.c ¿El modelo respeta el precio de venta si cambia el precio del producto?

**Consigna.** Analizar si se conserva el precio al que se vendió cada producto cuando se modifica su
precio; si no, proponer una solución.

**Resolución.** Si el único precio es `PRODUCTO.Precio`, **no**: al hacer `UPDATE` del precio, todas
las facturas viejas pasarían a mostrar el precio nuevo y su importe dejaría de cerrar. Solución:
guardar el **precio de venta en la relación** `CONTIENE` (`PrecioUnitario`), copiado del precio
vigente en el momento de facturar. `PRODUCTO.Precio` queda como precio actual y el renglón de la
factura conserva el histórico. Verificado en MySQL: después de subir el precio de 100 a 150, la
factura sigue mostrando `PrecioUnitario = 100.00` y su importe recalculado da `200.00`.

(nota) Alternativa válida: una entidad débil `PRECIO_HISTORICO (Codigo, FechaDesde, Precio)` y
buscar el precio vigente a la fecha de la factura. Es más compleja; la del atributo en la relación es
la respuesta esperada.

### 1.d Derivación al esquema lógico

**Esquema.**

- `CLIENTE (`**`IdCliente`**`, Nombre, Apellido, FechaNacimiento, Direccion, TelefonoPrincipal, TelefonoAlternativo?)`
- `CELULAR_CLIENTE (`**`IdCliente`**`, `**`Celular`**`)` — multivaluado → otra tabla; FK `IdCliente` → `CLIENTE`
- `PRODUCTO (`**`Codigo`**`, Nombre, Precio)`
- `FACTURA (`**`Tipo`**`, `**`Numero`**`, Fecha, ImporteTotal, IdCliente)` — FK `IdCliente` → `CLIENTE`
- `CONTIENE (`**`Tipo`**`, `**`Numero`**`, `**`Codigo`**`, Cantidad, PrecioUnitario)` — FK `(Tipo, Numero)` → `FACTURA`; FK `Codigo` → `PRODUCTO`

```sql
CREATE TABLE CLIENTE (
  IdCliente           INT          NOT NULL,
  Nombre              VARCHAR(50)  NOT NULL,
  Apellido            VARCHAR(50)  NOT NULL,
  FechaNacimiento     DATE         NOT NULL,
  Direccion           VARCHAR(100) NOT NULL,
  TelefonoPrincipal   VARCHAR(20)  NOT NULL,
  TelefonoAlternativo VARCHAR(20),
  CONSTRAINT PK_CLIENTE PRIMARY KEY (IdCliente)
);

CREATE TABLE CELULAR_CLIENTE (
  IdCliente INT         NOT NULL,
  Celular   VARCHAR(20) NOT NULL,
  CONSTRAINT PK_CELULAR_CLIENTE PRIMARY KEY (IdCliente, Celular)
);

CREATE TABLE PRODUCTO (
  Codigo INT           NOT NULL,
  Nombre VARCHAR(60)   NOT NULL,
  Precio DECIMAL(12,2) NOT NULL,
  CONSTRAINT PK_PRODUCTO PRIMARY KEY (Codigo)
);

CREATE TABLE FACTURA (
  Tipo         CHAR(1)       NOT NULL,
  Numero       INT           NOT NULL,
  Fecha        DATE          NOT NULL,
  ImporteTotal DECIMAL(12,2) NOT NULL,
  IdCliente    INT           NOT NULL,
  CONSTRAINT PK_FACTURA PRIMARY KEY (Tipo, Numero)
);

CREATE TABLE CONTIENE (
  Tipo           CHAR(1)       NOT NULL,
  Numero         INT           NOT NULL,
  Codigo         INT           NOT NULL,
  Cantidad       INT           NOT NULL,
  PrecioUnitario DECIMAL(12,2) NOT NULL,
  CONSTRAINT PK_CONTIENE PRIMARY KEY (Tipo, Numero, Codigo)
);

ALTER TABLE CELULAR_CLIENTE ADD CONSTRAINT FK_CELULAR_CLIENTE_CLIENTE
  FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente);
ALTER TABLE FACTURA ADD CONSTRAINT FK_FACTURA_CLIENTE
  FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente);
ALTER TABLE CONTIENE ADD CONSTRAINT FK_CONTIENE_FACTURA
  FOREIGN KEY (Tipo, Numero) REFERENCES FACTURA(Tipo, Numero);
ALTER TABLE CONTIENE ADD CONSTRAINT FK_CONTIENE_PRODUCTO
  FOREIGN KEY (Codigo) REFERENCES PRODUCTO(Codigo);
```

`IdCliente` en `FACTURA` es `NOT NULL` porque el mínimo junto a `CLIENTE` es 1. La FK hacia
`FACTURA` es compuesta porque su clave lo es.

## Ejercicio 2 — Depósito: empleados, departamentos, productos y fabricantes

### 2.a DERE

**Consigna.** Empleados (número, nombre, apellido, dirección compuesta por calle, puerta, piso y
ciudad; departamento al que pertenecen), departamentos (identificados por nombre; empleados, jefe
—uno por departamento, y un empleado es jefe de uno solo— y productos que vende), productos (nombre,
fabricante, precio de venta; identificados por el número del fabricante o por el del depósito) y
fabricantes (nombre, dirección, productos que suministra y su precio).

**Resolución.**

![DERE del ejercicio 2](../assets/guia-tp01-ej2.png)

| Elemento | Decisión | Por qué |
| --- | --- | --- |
| `EMPLEADO.Direccion` | **compuesto** (`Calle`, `Puerta`, `Piso`, `Ciudad`); `Piso` opcional | el enunciado da los componentes; una casa no tiene piso |
| `TRABAJA_EN` | 1:N, `EMPLEADO (1,N)` · `DEPARTAMENTO (1,1)` | cada empleado pertenece a un departamento; cada departamento tiene empleados (al menos su jefe) |
| `DIRIGE` | **1:1**, `EMPLEADO (1,1)` · `DEPARTAMENTO (0,1)` | un jefe por departamento; un empleado es jefe de a lo sumo uno |
| `PRODUCTO.NroProdDeposito` | IP | lo asigna el depósito: único en todo el sistema |
| `PRODUCTO.NroProdFabricante` | identificador **alternativo** | identifica al producto, pero solo **junto con el fabricante** (dos fabricantes pueden usar el mismo número) |
| `VENDE` | N:N, `(0,N)` de los dos lados | un departamento vende varios productos; el enunciado no impide que un producto se venda en más de uno |
| `SUMINISTRA` | 1:N, `PRODUCTO (1,N)` · `FABRICANTE (1,1)` | cada producto tiene un fabricante; un fabricante suministra uno o más productos |
| `PrecioCompra` | atributo de `SUMINISTRA` | "precios de estos productos" es el precio del fabricante, distinto del precio de venta |

(nota) `DIRIGE` y `TRABAJA_EN` son dos relaciones distintas entre las mismas entidades: no se fusionan.
Que el jefe trabaje en el mismo departamento que dirige no se puede expresar en el DERE: es una
restricción adicional (se resuelve con un trigger, ver [[Guía TP07 - Restricciones avanzadas|TP 7]]).

### 2.b Derivación al esquema lógico

**Esquema.**

- `FABRICANTE (`**`Nombre`**`, Direccion)`
- `DEPARTAMENTO (`**`Nombre`**`, NroEmpleadoJefe)` — FK → `EMPLEADO`, `UNIQUE` (1:1)
- `EMPLEADO (`**`NroEmpleado`**`, Nombre, Apellido, Calle, Puerta, Piso?, Ciudad, NombreDepto)` — FK `NombreDepto` → `DEPARTAMENTO`
- `PRODUCTO (`**`NroProdDeposito`**`, NroProdFabricante, NombreFabricante, Nombre, PrecioVenta, PrecioCompra)` — FK `NombreFabricante` → `FABRICANTE`; `UNIQUE (NombreFabricante, NroProdFabricante)`
- `VENDE (`**`NombreDepto`**`, `**`NroProdDeposito`**`)` — dos FK

Reglas aplicadas: el compuesto se despliega en sus partes; `PrecioCompra` (atributo de una 1:N) va a
la tabla del lado N; el identificador alternativo se declara `UNIQUE`; la 1:1 se baja como una 1:N
con la FK del lado que participa con mínimo 1 (`DEPARTAMENTO`, que siempre tiene jefe) más `UNIQUE`
para que un empleado no pueda ser jefe de dos.

```sql
CREATE TABLE FABRICANTE (
  Nombre    VARCHAR(60)  NOT NULL,
  Direccion VARCHAR(100) NOT NULL,
  CONSTRAINT PK_FABRICANTE PRIMARY KEY (Nombre)
);

CREATE TABLE DEPARTAMENTO (
  Nombre          VARCHAR(40) NOT NULL,
  NroEmpleadoJefe INT,
  CONSTRAINT PK_DEPARTAMENTO PRIMARY KEY (Nombre),
  CONSTRAINT AK_DEPARTAMENTO_JEFE UNIQUE (NroEmpleadoJefe)
);

CREATE TABLE EMPLEADO (
  NroEmpleado  INT          NOT NULL,
  Nombre       VARCHAR(50)  NOT NULL,
  Apellido     VARCHAR(50)  NOT NULL,
  Calle        VARCHAR(60)  NOT NULL,
  Puerta       VARCHAR(10)  NOT NULL,
  Piso         VARCHAR(5),
  Ciudad       VARCHAR(50)  NOT NULL,
  NombreDepto  VARCHAR(40)  NOT NULL,
  CONSTRAINT PK_EMPLEADO PRIMARY KEY (NroEmpleado)
);

CREATE TABLE PRODUCTO (
  NroProdDeposito   INT           NOT NULL,
  NroProdFabricante VARCHAR(30)   NOT NULL,
  NombreFabricante  VARCHAR(60)   NOT NULL,
  Nombre            VARCHAR(60)   NOT NULL,
  PrecioVenta       DECIMAL(12,2) NOT NULL,
  PrecioCompra      DECIMAL(12,2) NOT NULL,
  CONSTRAINT PK_PRODUCTO PRIMARY KEY (NroProdDeposito),
  CONSTRAINT AK_PRODUCTO_FABRICANTE UNIQUE (NombreFabricante, NroProdFabricante)
);

CREATE TABLE VENDE (
  NombreDepto     VARCHAR(40) NOT NULL,
  NroProdDeposito INT         NOT NULL,
  CONSTRAINT PK_VENDE PRIMARY KEY (NombreDepto, NroProdDeposito)
);

ALTER TABLE EMPLEADO ADD CONSTRAINT FK_EMPLEADO_DEPARTAMENTO
  FOREIGN KEY (NombreDepto) REFERENCES DEPARTAMENTO(Nombre);
ALTER TABLE DEPARTAMENTO ADD CONSTRAINT FK_DEPARTAMENTO_EMPLEADO
  FOREIGN KEY (NroEmpleadoJefe) REFERENCES EMPLEADO(NroEmpleado);
ALTER TABLE PRODUCTO ADD CONSTRAINT FK_PRODUCTO_FABRICANTE
  FOREIGN KEY (NombreFabricante) REFERENCES FABRICANTE(Nombre);
ALTER TABLE VENDE ADD CONSTRAINT FK_VENDE_DEPARTAMENTO
  FOREIGN KEY (NombreDepto) REFERENCES DEPARTAMENTO(Nombre);
ALTER TABLE VENDE ADD CONSTRAINT FK_VENDE_PRODUCTO
  FOREIGN KEY (NroProdDeposito) REFERENCES PRODUCTO(NroProdDeposito);
```

(atención) `NroEmpleadoJefe` queda **nullable** aunque el DERE diga que el jefe es obligatorio:
`EMPLEADO` y `DEPARTAMENTO` se referencian en ciclo, y con las dos FK `NOT NULL` no se puede insertar
el primer registro de ninguna (verificado: MySQL rechaza ambos `INSERT` con error 1452, y no tiene
FK diferibles). Se carga primero el departamento sin jefe, después los empleados y por último un
`UPDATE` que asigna el jefe. Verificado también que el `UNIQUE` rechaza a un empleado como jefe de dos
departamentos y que el alternativo rechaza un `NroProdFabricante` repetido del mismo fabricante.

## Ejercicio 3 — Empresa de transportes

### 3.a DERE

**Consigna.** Camioneros (DNI, nombre, teléfono, dirección, salario, ciudad en la que viven),
paquetes (código, descripción, destinatario, dirección del destinatario), ciudades (código, nombre) y
camiones (matrícula, modelo, tipo, potencia). Un camionero distribuye muchos paquetes y cada paquete
lo distribuye uno solo; cada paquete llega a una ciudad y a una ciudad llegan varios; un camionero
conduce distintos camiones en fechas distintas y un camión lo conducen varios camioneros.

**Resolución.**

![DERE del ejercicio 3](../assets/guia-tp01-ej3.png)

| Elemento | Decisión | Por qué |
| --- | --- | --- |
| `DISTRIBUYE` | 1:N, `CAMIONERO (1,1)` · `PAQUETE (0,N)` | "un paquete sólo puede ser distribuido por un camionero" |
| `LLEGA_A` | 1:N, `PAQUETE (0,N)` · `CIUDAD (1,1)` | "un paquete sólo puede llegar a una ciudad… a una ciudad pueden llegar varios" |
| `CONDUCE` | **N:N** con atributo `Fecha`, `(0,N)` de los dos lados | "diferentes camiones en fechas diferentes… un camión puede ser conducido por varios" |
| `VIVE_EN` | 1:N, `CAMIONERO (0,N)` · `CIUDAD (1,1)` | la ciudad ya es entidad: se la relaciona en lugar de repetir su nombre como atributo |

(nota) Modelar "ciudad en la que vive" como un atributo simple de `CAMIONERO` también es aceptable si
la ciudad de residencia puede no estar entre las ciudades de destino; con la relación se evita la
redundancia.

### 3.b Derivación al esquema lógico

**Esquema.**

- `CIUDAD (`**`CodCiudad`**`, Nombre)`
- `CAMIONERO (`**`DNI`**`, Nombre, Telefono, Direccion, Salario, CodCiudadVive)` — FK → `CIUDAD`
- `CAMION (`**`Matricula`**`, Modelo, Tipo, Potencia)`
- `PAQUETE (`**`CodPaquete`**`, Descripcion, Destinatario, DireccionDestinatario, DNICamionero, CodCiudad)` — FK → `CAMIONERO`, FK → `CIUDAD`
- `CONDUCE (`**`DNI`**`, `**`Matricula`**`, `**`Fecha`**`)` — FK → `CAMIONERO`, FK → `CAMION`

(clave) En `CONDUCE` la PK es `(DNI, Matricula, Fecha)`, no solo las dos claves yuxtapuestas: con
`(DNI, Matricula)` el mismo camionero no podría volver a conducir el mismo camión otro día.
Verificado: con la PK de tres columnas MySQL acepta el mismo par en dos fechas y rechaza la
repetición exacta (error 1062).

```sql
CREATE TABLE CIUDAD (
  CodCiudad INT         NOT NULL,
  Nombre    VARCHAR(60) NOT NULL,
  CONSTRAINT PK_CIUDAD PRIMARY KEY (CodCiudad)
);

CREATE TABLE CAMIONERO (
  DNI             INT           NOT NULL,
  Nombre          VARCHAR(60)   NOT NULL,
  Telefono        VARCHAR(20)   NOT NULL,
  Direccion       VARCHAR(100)  NOT NULL,
  Salario         DECIMAL(12,2) NOT NULL,
  CodCiudadVive   INT           NOT NULL,
  CONSTRAINT PK_CAMIONERO PRIMARY KEY (DNI)
);

CREATE TABLE CAMION (
  Matricula VARCHAR(10) NOT NULL,
  Modelo    VARCHAR(40) NOT NULL,
  Tipo      VARCHAR(30) NOT NULL,
  Potencia  INT         NOT NULL,
  CONSTRAINT PK_CAMION PRIMARY KEY (Matricula)
);

CREATE TABLE PAQUETE (
  CodPaquete            INT          NOT NULL,
  Descripcion           VARCHAR(100) NOT NULL,
  Destinatario          VARCHAR(60)  NOT NULL,
  DireccionDestinatario VARCHAR(100) NOT NULL,
  DNICamionero          INT          NOT NULL,
  CodCiudad             INT          NOT NULL,
  CONSTRAINT PK_PAQUETE PRIMARY KEY (CodPaquete)
);

CREATE TABLE CONDUCE (
  DNI       INT         NOT NULL,
  Matricula VARCHAR(10) NOT NULL,
  Fecha     DATE        NOT NULL,
  CONSTRAINT PK_CONDUCE PRIMARY KEY (DNI, Matricula, Fecha)
);

ALTER TABLE CAMIONERO ADD CONSTRAINT FK_CAMIONERO_CIUDAD
  FOREIGN KEY (CodCiudadVive) REFERENCES CIUDAD(CodCiudad);
ALTER TABLE PAQUETE ADD CONSTRAINT FK_PAQUETE_CAMIONERO
  FOREIGN KEY (DNICamionero) REFERENCES CAMIONERO(DNI);
ALTER TABLE PAQUETE ADD CONSTRAINT FK_PAQUETE_CIUDAD
  FOREIGN KEY (CodCiudad) REFERENCES CIUDAD(CodCiudad);
ALTER TABLE CONDUCE ADD CONSTRAINT FK_CONDUCE_CAMIONERO
  FOREIGN KEY (DNI) REFERENCES CAMIONERO(DNI);
ALTER TABLE CONDUCE ADD CONSTRAINT FK_CONDUCE_CAMION
  FOREIGN KEY (Matricula) REFERENCES CAMION(Matricula);
```

## Enlaces

- Práctica: [[Práctica 2026-08-04|Práctica del 04/08]]
- Teóricas: [[Clase 02 - Modelo Entidad-Relacion|Clase 02 — Modelo Entidad-Relación]] ·
  [[Clase 03 - Derivación a Esquema Lógico|Clase 03 — Derivación a esquema lógico]]
- Conceptos: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]]
- Guía siguiente: [[Guía TP02 - Creates|TP 2 — Creates]]
- Motor: [[MySQL]]
