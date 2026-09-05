# Brief — baseline visual y estructural de la app de Proba (fuente para el mockup de Sinapsis)

Extraído el 2026-09-05 de `~/Desktop/ITBA/26-1C/Proba_Obsidian/estudio/` (styles.css, nav.css, core.js, DESIGN.md)
y del handoff `~/Desktop/ITBA/26-1C/Proba_Obsidian/HANDOFF-plataforma-multimateria.md`.
Capturas reales de la app en esta misma carpeta:
- `inicio-pergamino.png` · `inicio-claustro.png` — vista Inicio (dashboard de progreso) en tema claro y oscuro, 1440×900
- `lector-pergamino.png` · `lector-claustro.png` — lector de una página del wiki (Distribución Normal)
- `wiki-pergamino.png` — catálogo del wiki con filtros
- `plan-laurel.png` — plan de estudio en el tercer tema (Laurel)

## Estética declarada
"University press" / "institución prestigiosa": papel, tinta y oro; filetes finos; versalitas; relieve de imprenta
(bisel `--relief`); grano de papel sutil (ruido SVG); matemática KaTeX sobre placas con filete.
Tres temas que redefinen los mismos tokens:
- **Pergamino** (claro, por defecto): bg #ece3d2 · surface #faf5ea · text #231c12 · primary (oxblood) #7c2230 · accent (oro viejo) #9c7a2d · border #ddd2bb
- **Laurel** (claro): bg #e7e6d6 · surface #f8f6ec · text #1b2117 · primary (verde inglés) #1f4d39 · accent #9c7a2d
- **Claustro** (oscuro): bg #15120c · surface #1e1910 · text #ece2cd · primary (oro) #c79a4e · accent (terracota) #c4705a · border #322a1a

## Tipografía (5 familias, vendorizadas)
- UI: Hanken Grotesk (500/600/700) · Lectura: Spectral (serif) · Display/títulos: Fraunces (serif editorial)
- Cifras/técnico: JetBrains Mono · Piel "documento LaTeX": Latin Modern Roman
Radios: 8 / 12 / 16 / 22 px (controles 9 px). Transiciones 160 ms / 280 ms.

## Layout (medidas reales)
- Shell: `aside#sidebar` (doble columna) + columna de contenido (`header` 40 px con pestañas estilo Obsidian + buscador ⌘K + botón de tema; `nav#crumbs` breadcrumb 28 px; `main`).
- **Rail** (columna 1): 52 px de ancho, solo iconos 18 px, siempre visible. Arriba el logo circular "P" (oxblood, aro dorado, letra serif itálica) que hoy enlaza a #/inicio. Debajo, grupos separados por filete de 1 px; cada grupo tiene un color de icono propio (token de color de la "intención"). Abajo, botón de plegar el índice.
- **Panel índice** (columna 2): 250 px, plegable. Arriba el hero de materia `sb-top`: título en negrita 13 px ("Probabilidad y Estadística") y subtítulo 10.5 px gris ("93.24 · ITBA"). Debajo rótulo versalita "PROGRAMA" y el árbol: unidades (punto de color + "U1 · Nombre" + contador + chevron) → bloques por tipo (rótulo versalita pegajoso: CONCEPTOS · DISTRIBUCIONES · TEOREMAS · TÉCNICAS · FORMULARIOS · FUENTES, con contador) → páginas numeradas "01", "02"… con estado leído.
- Ancho de lectura 840 px (hoja `.sheet` elevada con relieve); vistas anchas 1120 px. Lector con columna derecha (248 px): "EN ESTA PÁGINA" (TOC con scroll-spy), "FUENTES", "ENLAZAN AQUÍ".
- Lector: barra de unidad sobre la hoja (segmentos por página, popover "¿Qué sigue?"), migas, botones "Marcar estudiado" y "Guardar", placas de fórmula, callouts de Obsidian, figuras SVG interactivas.

## Rail actual de Proba: NAV_SECTIONS (agrupado por intención, no por tipo de herramienta)
1. Mi ruta (color --primary): Inicio · Plan de estudio · Kits de estudio
2. Consultar (--u3 violeta): Todo el wiki · Formularios · Explorador de distribuciones · Grafo de conexiones
3. Practicar (--good verde): Flashcards · Quiz · Ejercicios · Simulador de parcial
4. Resolver (--accent oro): Taller de resolución · Calculadoras · ¿Qué distribución o prueba? · Laboratorio Monte Carlo
5. Lo mío (--warn ámbar): Mis apuntes · Favoritos
6. Wiki (--text-2 gris): Índice del wiki · Registro del wiki
Cada ítem = {route, icon, label}. Este objeto es exactamente el contrato de configuración del rail por materia.
Genéricos para cualquier materia: Inicio, Plan, Kits, Todo el wiki, Grafo, Flashcards, Quiz, Ejercicios, Apuntes, Favoritos, Índice, Registro.
Específicos de Proba (ejemplo de "herramienta de materia"): Explorador de distribuciones, Taller, Calculadoras, Asistente, Laboratorio, Formularios.

## Colores categóricos por unidad (registro heráldico, apagado)
--u1 #3f7a6e · --u2 #2f5a8f · --u3 #6a4a8c · --u4 #b6532f · --u5 #9c3a5f · --u6 #bd7327 · --u7 #5f4a11 · --u8 #4a7a3a · --u9 #9c3a30 · --u0 #7a7158 · --ueval #9a7320 · --umeta #3a3244
Limitación conocida: son 12 tokens fijos; una materia con 5 o 14 divisiones necesita una escala paramétrica.

## Lo que la plataforma nueva debe volver configuración (del handoff §4)
- La "P" del rail pasa a ser el botón de volver a la landing (glifo de la plataforma, no de la materia).
- El hero `sb-top` pasa a leer nombre + código + institución de la materia activa.
- El rótulo de división del temario deja de ser "Unidad N": pasa a ser dato {singular, abreviatura, plural} (módulo, capítulo, semana, TP, bloque…).
- Los tipos de página (concepto, distribución, teorema, técnica, formulario, fuente) pasan a ser por materia (otra materia: caso, ley, algoritmo, práctica, lectura…).
- Progreso/apuntes/pestañas namespaciados por materia. Pregunta abierta: ¿tema global o por materia?
- Landing: todas las materias ordenadas por cuatrimestre, gestionadas por el usuario (agregar/quitar/ordenar).

## Contrato de datos Page (lo que cualquier materia emite)
{slug, title, tipo, folder, unidad, orden?, resumen, formato, tags[], fuentes[], actualizado, links[], headings[], body, words}

## Decisiones ya tomadas para la app de Proba (NO aplican necesariamente a Sinapsis, que será SPA React con BD y login Google)
Vanilla JS sin build, file:// con doble clic, datos compilados desde markdown. Sinapsis rompe con eso por decisión del usuario:
SPA React + BD + autenticación Google, hosteado localmente pensando en deploy futuro.
