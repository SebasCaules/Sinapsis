---
title: Cadenas de firmas y autoridades raíz
resumen: 'Dónde se corta la recursión de quién firma al que firma: autoridades raíz autofirmadas, cadenas de certificados que viajan junto al certificado final, y la lista de raíces preinstalada en sistemas y navegadores.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[certificados-digitales]]", "[[x509]]", "[[revocacion-y-listas-crl]]"]
aliases: [Cadenas de firmas, Autoridad certificante raíz, AC raíz, Root CA, Delegación de confianza en PKI, Validación entre CAs]
type: concepto
unidad: 1
clase: 5
orden: 4
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, pki, certificados, autoridad-certificante, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Cadenas de firmas y autoridades raíz

**Dónde se corta la recursión de "¿quién firma al que firma?": en una autoridad que se firma a sí misma, y en la que se confía sin más pruebas.** Es la nota que cierra la pregunta que dejó abierta [[certificados-digitales#La pregunta que queda abierta|Certificados digitales]], y la que explica por qué, en la práctica, un sistema no valida una única cadena sino que confía en una **lista** de raíces.

Cubre las filminas **11 a 13** del PDF de teoría de la Clase 05. **Esta clase todavía no se dictó** — hoy es 04/09/2026, la fecha del [[cronograma]] es el 17/09 —, así que la nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas; no hay transcripción de esta clase. La fórmula de la filmina 12 fue verificada renderizando la página a 150 dpi: el texto extraído la reproduce fielmente.

## La respuesta: las autoridades certificantes también tienen certificado

*Filmina 11.* La salida a la pregunta de "¿cómo se obtiene la clave pública que valida la firma de un certificado?" es aplicar la misma idea una capa arriba: **las autoridades certificantes tienen, a su vez, un certificado**, y se acostumbra **incluirlo** junto con cada certificado que emiten — así quien recibe un certificado no tiene que ir a buscar por separado el de su emisor.

Pero eso solo traslada la pregunta: ¿quién valida el certificado de la `AC`? La respuesta de la filmina es literal: **¡otra AC!** — y ahí es donde hace falta un punto de corte, porque de otro modo la cadena de "¿quién certifica al certificador?" no termina nunca. Las **AC raíces** son ese punto de corte: son las autoridades que **firman su propio certificado** — están autofirmadas — y son, por definición, **el punto de confianza del sistema**. No hay una autoridad más arriba que valide a la raíz; se confía en ella porque el sistema (sistema operativo, navegador, runtime) la trae preinstalada como confiable.

## El concepto de AC raíz, en una frase

*Filmina 12.* **Confiar en una única autoridad, que delega en otras la capacidad de firmar certificados.** La delegación es la pieza que permite que existan intermediarios entre la raíz y el certificado final — sin que cada certificado tenga que estar firmado directamente por la raíz.

La filmina lo fija con notación concreta, para un certificado de $A$ firmado por $CA_3$ —notado $A\!\ll\!CA_3\!\gg$— que a su vez forma parte de una cadena hasta la raíz $CA_1$, y uno de $B$ firmado **directamente** por la raíz:

$$C_a = C'_a \,\Vert\, C_{CA_3} \,\Vert\, C_{CA_2} \,\Vert\, C_{CA_1}, \qquad\qquad C_b = C'_b \,\Vert\, C_{CA_1}$$

donde $C'_x$ es el propio certificado firmado de $x$, y el resto de la concatenación son los certificados de cada eslabón de la cadena, hasta la raíz. La idea que la notación transmite: **un certificado no viaja solo** — viaja acompañado de la cadena completa de certificados que hace falta para subir, eslabón por eslabón, desde $C'_a$ hasta una raíz en la que quien recibe ya confía. Con $C_a$ en mano, quien lo recibe no necesita salir a buscar nada más: valida $C_{CA_1}$ contra la raíz que ya tiene preinstalada, usa esa clave para validar $C_{CA_2}$, esa para validar $C_{CA_3}$, y finalmente esa para validar $C'_a$.

> **Por qué $C_b$ es más corta que $C_a$** *(lectura nuestra, se sigue directamente del ejemplo)*: no todos los certificados están a la misma "distancia" de la raíz. $B$ obtuvo su certificado directamente de $CA_1$, así que su cadena tiene un solo eslabón intermedio; $A$ lo obtuvo de $CA_3$, que a su vez fue certificada por $CA_2$ y esta por $CA_1$, así que su cadena tiene tres. La profundidad de la cadena depende de cuántos niveles de delegación existan entre la raíz y quien finalmente emitió el certificado — no hay ningún límite fijo en el esquema.

## Pero no hay una única AC raíz universal

*Filmina 13.* Si $A$ confía en $CA_1$ como raíz y $B$ depende de una $CA$ distinta —digamos $CA_4$—, ¿cómo valida $A$ el certificado de $B$? La filmina da dos opciones, no excluyentes entre sí:

1. **$A$ confía directamente en la AC de $B$** — agrega $CA_4$ a su propio conjunto de raíces confiables.
2. **Las AC se certifican entre sí** — cada una emite un certificado de la identidad de la otra, de modo que la cadena de $B$ puede subir hasta $CA_4$ y de ahí "cruzar" hacia $CA_1$ vía el certificado que $CA_1$ le emitió a $CA_4$ (o viceversa).

**En la práctica, ninguna de las dos se negocia por conexión.** Lo que existe es una **lista de AC reconocidas**, preinstalada de antemano en tres lugares distintos: el **sistema operativo**, los **navegadores**, y runtimes como la **JVM**. Esa lista es la que reemplaza, en el mundo real, a la elección explícita de "opción 1 o 2" para cada par de partes que se quieren comunicar: si la raíz de la cadena de $B$ ya está en la lista preinstalada de $A$, la validación es automática y no requiere ninguna negociación adicional.

> **Por qué el mismo navegador puede confiar en cientos de raíces distintas** *(lectura nuestra, no desarrollado en la filmina)*: cada raíz preinstalada es una decisión de confianza independiente, tomada por el fabricante del sistema operativo o del navegador —no por el usuario final en el momento de la conexión—. Esto explica por qué revocar la confianza en una raíz comprometida es un evento raro y disruptivo: implica una actualización del sistema, no una negociación de protocolo.

## Ver también

- [[clase-05-protocolos-criptograficos#5. Cadenas de firmas y autoridades raíz|Clase 05 — Protocolos criptográficos, sección 5]] — la sección de la que sale esta nota
- [[certificados-digitales|Certificados digitales]] — qué es exactamente lo que una AC firma
- [[x509|X.509]] — el estándar donde esta cadena de firmas se instancia con un certificado real, autofirmado y marcado `CA:TRUE`
- [[revocacion-y-listas-crl|Revocación y listas CRL]] — qué pasa cuando un eslabón de esta cadena se compromete antes de su expiración
- [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]] — la firma digital sobre la que se construye cada eslabón de la cadena
