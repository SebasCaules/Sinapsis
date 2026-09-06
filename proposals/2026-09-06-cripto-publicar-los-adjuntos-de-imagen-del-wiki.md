---
fecha: 2026-09-06
materia: cripto
titulo: "Publicar los adjuntos de imagen del wiki"
rama: proposal/cripto-20260906-publicar-los-adjuntos-de-imagen-del-wiki
estado: cambios-pedidos
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

**Veredicto:** cambios-pedidos
**Revisó:** orquestador de la plataforma · 2026-09-06
**Commit de merge:** no corresponde

### Gates en la rama
- `pnpm typecheck`: no corresponde (`--skip-gates`; se comprobó con `git diff --stat main...rama` que la rama no cambia código ejecutable: solo trae este archivo)
- `pnpm test`: no corresponde
- `pnpm build`: no corresponde
- `pnpm e2e`: no corresponde

### Hallazgos
1. **(alto)** La propuesta no trae implementación. El contrato 07 (§1 y §3.1, punto 3) pide que la materia implemente el cambio en una rama de la plataforma y pida revisión; esta rama solo trae el pedido. El motivo es válido y el problema es de la plataforma (el contrato 02 §11 lo lista como no soportado), así que no se rechaza: se pide la implementación, con la forma fijada abajo.
2. **(medio)** «Alcance» — lista `.claude/devoluciones/2026-09-06-sprint4-sitio-estatico.md` como archivo cambiado. Es un archivo sin seguimiento, ajeno a la propuesta, que estaba en el árbol de la plataforma al proponer; ni siquiera viajó en el commit. La sección tiene que decir lo que la rama trae de verdad.
3. **(bajo)** «Motivo» — dice «76 imágenes en 8 páginas»; en la rama `subject/cripto-20260906` son 76 referencias repartidas en 26 páginas (`grep -rl '](../../assets/' wiki`). Corregir el dato.

### Qué hace falta para aprobar
La plataforma fija la forma; la implementación viene en esta misma rama, con sus tests:

1. **Compilador** (`packages/markdown`): reconocer `![alt](ruta relativa)` cuyo destino resuelve dentro del vault (relativo a la página), con estas guardas: solo extensiones de imagen (`png`, `jpg`, `jpeg`, `gif`, `svg`, `webp`); sin rutas absolutas ni URLs; un `..` que salga de la raíz del vault se descarta con advertencia; un destino que no existe se deja como está y se avisa. Emitir la lista de adjuntos de la materia (archivo de origen → nombre estable con hash de contenido) como salida **opcional con default vacío**, para que Proba y cualquier materia sin imágenes compilen exactamente igual.
2. **`publish`** (`packages/cli`): copiar los adjuntos reconocidos a `subjects/<slug>/assets/<hash>.<ext>`, con un tope de tamaño por archivo y por materia decidido en la propuesta, documentado y con advertencia al superarlo.
3. **`site build`**: emitir los adjuntos bajo una ruta estable de la salida (`subjects/<slug>/assets/…`), como hoy hace con los bundles, respetando `BASE_URL`.
4. **Lector** (`apps/web`): reescribir el `src` relativo al renderizar (un plugin de remark que consulta el mapa de adjuntos de la página), **sin `rehype-raw`** y sin admitir `javascript:` ni `data:`. Una referencia que no está en el mapa se deja intacta.
5. **Contrato y decisiones**: `docs/contracts/02-paginas.md` §4 (si `Page` gana un campo: opcional y con default) y §11 (la fila de adjuntos); una fila `N0-nn` en `docs/DECISIONS.md` con el porqué y el costo de revertir; si cambia un esquema de `packages/contract`, campo opcional con default y tests que validen los `sinapsis.config.json` existentes.
6. **Gates** sin `--skip-gates`, y las secciones «Alcance» y «Compatibilidad» acordes con lo que la rama trae (Proba sigue publicando igual: sin imágenes, sin adjuntos).

### Efecto en las materias
- Ninguno hasta que la propuesta vuelva con la implementación. Mientras tanto Cripto se publica con las imágenes rotas, que es la limitación vigente del contrato 02 §11.
