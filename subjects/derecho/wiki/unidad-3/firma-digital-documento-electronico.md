---
title: "Firma Digital y Documento Electronico"
resumen: "Explica la diferencia entre firma digital y firma electrónica, sus presunciones legales, los certificadores licenciados, la clasificación de documentos y por qué el documento electrónico tiene valor probatorio en juicio."
type: concepto
unidades: [3, 7]
unidad: 3
fuentes: ["Ley 25.506 (InfoLeg, texto actualizado)", "CCyC arts. 286-288 y 319", "Finales y Preguntas Típicas.txt", "final_julio_2019.txt", "Libro Cap 3 (hecho informatico)"]
fecha_creacion: 2026-07-18
ultima_actualizacion: 2026-07-18
---

# Firma Digital y Documento Electronico

Tema **recurrente de finales**: la catedra pregunta la diferencia entre firma digital y firma electronica, los tipos de documento (publico, privado, electronico) y si un documento electronico sirve como prueba en juicio. El marco normativo es la **Ley 25.506 de Firma Digital** (sancionada en 2001, texto actualizado en InfoLeg, ver [InfoLeg](https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/70749/texact.htm)), modificada por la **Ley 27.446** (B.O. 18/06/2018) y el **Decreto 27/2018**, y los arts. 286-288 y 319 del CCyC.

## Definicion normativa

**Firma digital (art. 2, Ley 25.506):** resultado de aplicar a un documento digital un **procedimiento matematico** que requiere informacion de **exclusivo conocimiento del firmante**, encontrandose esta bajo su **absoluto control**. Debe ser susceptible de verificacion por terceras partes, de modo que permita **identificar al firmante** y **detectar cualquier alteracion** del documento posterior a su firma.

**Equivalencia funcional (art. 3, Ley 25.506):** "cuando la ley requiera una firma manuscrita, esa exigencia tambien queda satisfecha por una firma digital". Es decir, la firma digital **vale como la firma olografa**.

**Documento digital (art. 6, Ley 25.506):** representacion digital de actos o hechos, con independencia del soporte utilizado para su fijacion, almacenamiento o archivo. Un documento digital **"tambien satisface el requerimiento de escritura"**.

En terminos de ingenieria: la firma digital es criptografia asimetrica — se firma con la **clave privada** (la "informacion de exclusivo conocimiento del firmante") y cualquier tercero verifica con la **clave publica** contenida en el certificado. El hash del documento detecta alteraciones.

## Firma digital vs. firma electronica

Esta es LA distincion que toma la catedra:

| Aspecto | Firma digital (art. 2) | Firma electronica (art. 5) |
|---------|------------------------|----------------------------|
| Definicion | Procedimiento matematico verificable por terceros | Conjunto de datos electronicos integrados, ligados o asociados al firmante, que **carece de alguno de los requisitos** para ser firma digital |
| Certificado | Emitido por **certificador licenciado** | No requiere certificador licenciado |
| Presunciones | Goza de presuncion de **autoria** (art. 7) e **integridad** (art. 8) | **Ninguna** presuncion legal |
| Carga de la prueba si se desconoce | Quien la **niega** debe probar que no es suya (se invierte la carga) | Quien la **invoca** debe acreditar su validez (art. 5) |
| Ejemplos | Firma con token/certificado de la infraestructura oficial de firma digital | Firma escaneada, PIN bancario, click en "acepto", firma en tablet de un courier |

**Regla mnemotecnica de examen:** ambas valen juridicamente, pero la digital **se presume** autentica e integra y la electronica **hay que probarla**.

## Presunciones de la firma digital

| Presuncion | Articulo | Contenido |
|------------|----------|-----------|
| **Autoria** | art. 7, Ley 25.506 | Se presume, salvo prueba en contrario, que toda firma digital pertenece al **titular del certificado digital** que permite verificarla |
| **Integridad** | art. 8, Ley 25.506 | Si el procedimiento de verificacion da resultado verdadero, se presume, salvo prueba en contrario, que el documento **no fue modificado** desde el momento de su firma |

Ambas son presunciones **iuris tantum** (admiten prueba en contrario).

## Requisitos de validez de la firma digital (art. 9, Ley 25.506)

Una firma digital es valida si:
1. Fue creada durante el **periodo de vigencia** del certificado digital valido del firmante;
2. Fue **debidamente verificada** por referencia a los datos de verificacion indicados en el certificado, segun el procedimiento de verificacion correspondiente;
3. El certificado fue emitido o reconocido por un **certificador licenciado**.

## Certificados digitales y certificadores licenciados

- **Certificado digital (art. 13):** documento digital firmado digitalmente por un certificador, que **vincula los datos de verificacion de firma (clave publica) a su titular**.
- **Requisitos del certificado (art. 14):** ser emitido por certificador licenciado, responder a formatos estandar internacionales, identificar indubitablemente a titular y certificador, y permitir verificar su estado de **revocacion**.
- **Certificador licenciado (art. 17):** "toda persona de existencia ideal, registro publico de contratos u organismo publico" que expide certificados y presta otros servicios en relacion con la firma digital, y **cuenta con una licencia otorgada por el ente licenciante** (el Estado licencia y audita a los certificadores — es una infraestructura de clave publica, PKI, con raiz estatal).

Analogia para ingenieros: el certificador licenciado cumple el rol de una **Certificate Authority (CA)** de confianza, como en TLS/HTTPS, pero con licencia estatal.

## Documento electronico y valor probatorio

**Respuesta corta de final: SI, el documento electronico tiene plena validez probatoria en juicio.**

- **Art. 6, Ley 25.506:** el documento digital satisface el requerimiento de escritura.
- **Art. 11, Ley 25.506:** los documentos digitales firmados digitalmente son considerados **originales** y poseen **valor probatorio como tales**.
- **Art. 286 CCyC:** la expresion escrita "puede hacerse constar en cualquier soporte, siempre que su contenido sea representado con texto inteligible, aunque su lectura exija medios tecnicos" (ver [leyes-ar.com, art. 286](https://leyes-ar.com/codigo_civil_y_comercial/286.htm)).
- **Art. 287 CCyC:** los instrumentos particulares **no firmados** comprenden todo escrito no firmado, cualquiera sea el medio empleado, incluidos los registros de la palabra y de informacion.
- **Art. 288 CCyC:** la firma prueba la autoria de la declaracion de voluntad; "en los instrumentos generados por medios electronicos, el requisito de la firma de una persona queda satisfecho si se utiliza una firma digital, que asegure indubitablemente la autoria e integridad del instrumento".
- **Art. 319 CCyC:** el valor probatorio de los instrumentos particulares lo aprecia el **juez**, ponderando entre otras pautas la congruencia entre lo sucedido y narrado, la precision y claridad tecnica del texto, los usos y practicas del trafico, las relaciones precedentes y la **confiabilidad de los soportes utilizados y de los procedimientos tecnicos que se apliquen** (ver [leyes-ar.com](https://leyes-ar.com/codigo_civil_y_comercial/319.htm)).

Sintesis: un documento electronico **con firma digital** es un instrumento privado firmado, original, con presunciones de autoria e integridad. Un documento electronico **sin firma digital** (mail, chat, PDF sin firmar) no queda excluido: es un **instrumento particular no firmado** (art. 287 CCyC) y el juez pondera su valor probatorio segun el art. 319 CCyC.

## Clasificacion: tipos de documento (pregunta tipica)

| Tipo | Quien interviene / forma | Valor probatorio |
|------|--------------------------|------------------|
| **Instrumento publico** | Oficial publico (ej. escribano en escritura publica) con las formalidades legales | Plena fe de su contenido; solo cae mediante impugnacion de falsedad por via judicial |
| **Instrumento privado** | Solo las partes, con **firma** | Prueba entre las partes una vez reconocida la firma |
| **Instrumento particular no firmado** (art. 287 CCyC) | Cualquier registro escrito, de palabra o de informacion, sin firma | Lo aprecia el juez (art. 319 CCyC) |
| **Documento electronico con firma digital** | Firmado con certificado de certificador licenciado | Equivale a instrumento privado firmado; original (art. 11) con presunciones de autoria e integridad |

## Reformas relevantes

- **Ley 27.446 (B.O. 18/06/2018):** modifico la Ley 25.506; **derogo los arts. 4** (que contenia exclusiones a la aplicacion de la ley), **18, 28, 35 y 36**, y **sustituyo los arts. 10, 27, 29, 30 inc. b) y 34** (ver [InfoLeg, Ley 27.446](https://servicios.infoleg.gob.ar/infolegInternet/verNorma.do?id=311583) y las notas del [texto actualizado de la 25.506](https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/70749/texact.htm)).
- **Decreto 27/2018 (B.O. 11/01/2018):** desburocratizacion; modifico los arts. 10, 27, 29, 30 y 34 de la Ley 25.506, cambios luego replicados por la Ley 27.446.

## Ejemplos practicos para ingenieros

- **Contratos de software o de obra firmados a distancia:** con firma digital tienen el mismo valor que firmados en papel ([[contratos-general]]).
- **Expediente electronico y facturacion electronica:** el Estado y las empresas operan sobre documentos digitales; su validez descansa en la Ley 25.506.
- **Constitucion de una SAS:** se hace por medios digitales con firma digital (ver [[guia-maestra-2do-parcial|guia del 2do parcial]]).
- **Logs y correos como prueba:** un mail sin firma digital no es "invalido": es un instrumento particular no firmado que el juez pondera (art. 319 CCyC) — la confiabilidad del soporte tecnico (hashes, sellado de tiempo, metadatos) pesa en esa ponderacion.
- **Analogia tecnica:** firma digital = firma con clave privada + verificacion con certificado X.509 emitido por una CA licenciada por el Estado.

## Como cayo en finales

Consignas textuales conocidas (fuente: `.converted/finales/Finales y Preguntas Típicas.txt` y `raw/finales/final_julio_2019.txt`):

- **29/10/2019 (figura como "parcial" en la fuente):** "Explicar los distintos tipos de documento (publico, privado, digital) y firma digital".
- **08/02/2019:** "¿Que es la firma digital? ¿Tiene un documento electronico validez como prueba en un proceso juridico?"
- **14/12/2018:** "Explique los tipos de Documentos Tradicionales y la diferencia con el Documento Electronico Firmado Digitalmente".
- **Julio 2019:** "Firma digital y documento electronico" (consigna a desarrollar).

**Respuesta modelo en 5 pasos:** (1) definir firma digital (art. 2) y su equivalencia con la manuscrita (art. 3); (2) distinguirla de la firma electronica (art. 5: sin presunciones, carga de la prueba invertida); (3) presunciones de autoria e integridad (arts. 7 y 8) y rol del certificador licenciado (arts. 13 y 17); (4) documento digital = escritura (art. 6) y original con valor probatorio (art. 11; arts. 286-288 CCyC); (5) cerrar con la clasificacion publico / privado / particular no firmado y la apreciacion judicial del art. 319 CCyC.

## Relacion con otras paginas

- [[contratos-general]] — forma de los contratos e instrumentos privados; firma digital en contratos.
- [[contratos-forma-prueba]] — forma y prueba de los contratos (Unidad 7): alli se cita la equivalencia de la Ley 25.506.
- [[obligaciones]] — la prueba del pago (recibo) y de las obligaciones puede instrumentarse digitalmente.
- [[mandato-y-poderes]] — los poderes exigen formas determinadas; la representacion tambien opera en entornos digitales.
- [[responsabilidad-civil]] — el documento electronico como prueba del incumplimiento o del daño.
- [[persona-fisica-y-juridica]] — el titular del certificado digital puede ser persona humana o juridica.

## Fuentes citadas

- **Ley 25.506 de Firma Digital**, texto actualizado: arts. 1, 2, 3, 5, 6, 7, 8, 9, 11, 13, 14 y 17; art. 4 derogado por Ley 27.446 (ver [InfoLeg](https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/70749/texact.htm), consultado 18/07/2026).
- **CCyC**, arts. [286](https://leyes-ar.com/codigo_civil_y_comercial/286.htm) y [287](https://leyes-ar.com/codigo_civil_y_comercial/287.htm) (leyes-ar.com), art. 288 (ver [Ley Fácil](https://leyfacil.com.ar/codigo-civil-y-comercial/articulo-288/)) y art. [319](https://leyes-ar.com/codigo_civil_y_comercial/319.htm) (leyes-ar.com). Textos verificados el 18/07/2026.
- `.converted/finales/Finales y Preguntas Típicas.txt` — consignas de finales 29/10/2019, 08/02/2019 y 14/12/2018.
- `raw/finales/final_julio_2019.txt` — consigna "Firma digital y documento electronico".
- Libro (Perego), cap. 3, seccion sobre el hecho informatico: menciona la firma digital, la identificacion biometrica y el protocolo seguro (https) como primeras soluciones a la contratacion electronica (`.book-extracts/cap3-completo.txt`).
