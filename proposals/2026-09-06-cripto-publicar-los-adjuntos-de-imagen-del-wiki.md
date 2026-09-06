---
fecha: 2026-09-06
materia: cripto
titulo: "Publicar los adjuntos de imagen del wiki"
rama: proposal/cripto-20260906-publicar-los-adjuntos-de-imagen-del-wiki
estado: abierta
pr: https://github.com/SebasCaules/Sinapsis/pull/2
---

## Motivo

El wiki de Criptografía y Seguridad trae 76 imágenes en 8 páginas y hoy no hay forma de publicarlas.

Qué son. No son decoración: son los diagramas que la cátedra usa para explicar y que el texto no reemplaza. La red de Feistel de DES y su función f, el esquema de una ronda de AES, los cinco modos de encadenamiento (ECB, CBC, CFB, OFB, CTR), la construcción de Merkle-Damgård, GCM, el record de TLS, el ciclo de modelado de amenazas, y las resoluciones manuscritas de las Guías 1 y 2, que son literalmente la respuesta a un ejercicio fotografiada.

Qué pasa hoy. El contrato 02 §11 dice que los adjuntos del vault no se publican porque `Page` solo tiene texto. Las 8 páginas se publican con el ícono de imagen rota: el markdown `![](../../assets/clase02-des-feistel.png)` llega crudo al lector y su `src` relativo se resuelve contra la ruta de la SPA, que no existe.

Por qué no se resuelve en la materia. Las tres salidas que tenemos son peores que el problema:

1. Borrar las imágenes del wiki. Rompe el vault en Obsidian, que es donde se estudia, para arreglar la copia publicada. La materia produce contenido; que ese contenido pierda sus figuras al publicarse no es una decisión de la materia.
2. Meterlas en un bundle de `tools/`. El contrato 04 admite assets sueltos, pero la URL de un archivo de bundle es `BASE_URL + ToolInfo.base + '/' + path`, y `BASE_URL` vale `/` en desarrollo y `/Sinapsis/` en producción. Una ruta escrita a mano en el cuerpo markdown no puede ser correcta en los dos entornos a la vez. Además convertiría un diagrama estático en una herramienta, que no es lo que es.
3. Alojarlas afuera y enlazarlas por URL absoluta. Le pone al material de la cátedra una dependencia de un tercero y una URL que se puede caer.

Qué se pide. Un mecanismo común para los adjuntos de imagen de un wiki: que el compilador los reconozca, que `publish` los copie a `subjects/<slug>/`, que `site build` los emita bajo una ruta estable y que el lector resuelva el `src` relativo del markdown contra esa ruta. La forma exacta la decide la plataforma; lo que la materia necesita es que `![](ruta relativa)` se vea.

Dos cosas que la propuesta no pide. No pide subir el tope de tamaño de nada: las 76 imágenes de esta materia pesan 6,9 MB en total. Y no pide tocar el markdown: `![alt](ruta)` ya es sintaxis estándar y es lo que Obsidian escribe solo al pegar una imagen.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `.claude/devoluciones/2026-09-06-sprint4-sitio-estatico.md` — nuevo

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Ninguna materia publicada hoy referencia adjuntos: Proba no tiene una sola imagen en wiki/. El cambio es aditivo — un wiki sin adjuntos compila igual — así que no rompe nada de lo ya publicado ni obliga a tocar ningún sinapsis.config.json existente.

## Gates

Omitidos con `--skip-gates`: la propuesta no cambia código ejecutable.

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
