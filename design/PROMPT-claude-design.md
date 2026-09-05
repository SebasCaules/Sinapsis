# Sinapsis — mockup de la landing y de la página de una materia (todo con placeholders)

## 1. Proyecto y objetivo

Sinapsis es una aplicación personal para organizar y estudiar los wikis de todas las materias de una carrera universitaria. Ya existe una app de estudio madura para una sola materia, con estética "university press" (papel, tinta y oro). Sinapsis la generaliza: una **landing** que lista todas las materias por cuatrimestre (el usuario las agrega, quita y ordena) y, dentro de cada materia, **exactamente el mismo shell de tres columnas**, con las dos barras laterales configurables por materia. El objetivo de diseño es **estandarizar** la vista de toda materia dejando **espacio a la flexibilidad**: cada materia declara sus herramientas y organiza su temario a su manera. El producto será una SPA React con base de datos y acceso con Google; de eso solo importa lo visible: estado autenticado y avatar.

Entregar dos pantallas con sus variantes, todo con placeholders: **01 Landing** y **02 Página de materia**. Antes, un artboard esquemático **00 Contrato de slots** que fije qué es fijo y qué es configurable.

## 2. Referencias adjuntas (la verdad visual)

Seis capturas reales de la app existente a 1440×900. Reproducir su lenguaje, densidad y proporciones; cambiar únicamente lo marcado aquí como placeholder o slot.
- `inicio-pergamino.png` / `inicio-claustro.png`: shell completo (rail, índice, cabecera) en tema claro y oscuro, vista Inicio de una materia.
- `lector-pergamino.png` / `lector-claustro.png`: lector de una página con hoja, placa de fórmula y columna derecha.
- `wiki-pergamino.png`: catálogo con cintillo versalita, filas de sección coloreadas y tarjetas (de aquí salen las piezas de la landing).
- `plan-laurel.png`: el tercer tema, Laurel.

## 3. Sistema visual (reproducir con exactitud)

- **Tipografías:** UI en Hanken Grotesk (500/600/700); lectura en Spectral; títulos en Fraunces (400–600, itálica en el sello); cifras, códigos y contadores en JetBrains Mono. Versalitas 10,5–11 px con tracking .06em; UI 12,5–13 px; lectura 17 px; display 22 / 40 px.
- **Geometría:** radios 8 / 12 / 16 / 22 px, controles 9 px. Filetes de 1 px siempre. Iconos de trazo 1,5 px: 18 px en el rail, 16 px en el resto.
- **Relieve de imprenta** en toda superficie elevada: `inset 0 1px 0 rgba(255,255,255,.75), inset 0 -1px 0 rgba(60,45,20,.10)`; sombra `0 1px 2px rgba(60,45,20,.06), 0 5px 16px rgba(60,45,20,.07)`. Grano de papel apenas perceptible sobre los fondos. Nada de sombras difusas grandes, degradados saturados ni ilustraciones.
- **Tres temas sobre los mismos nombres de token:**
  - **Pergamino** (claro, predeterminado): bg #ece3d2 · surface #faf5ea · surface-2 #f2ebdb · elevated #fdfaf1 · text #231c12 · text-2 #574b37 · text-3 #6a6150 · border #ddd2bb · border-2 #c9bca0 · primary #7c2230 · primary-soft #f1e0db · accent #9c7a2d · accent-soft #f1e7cf · good #3f7a43 · warn #9c6b1f · bad #a3322b.
  - **Laurel** (claro): bg #e7e6d6 · surface #f8f6ec · text #1b2117 · text-3 #606751 · border #d8dac1 · primary #1f4d39 · primary-soft #dde9df · accent #9c7a2d.
  - **Claustro** (oscuro): bg #15120c · surface #1e1910 · surface-2 #251f14 · elevated #332b1b · text #ece2cd · text-2 #bcae93 · text-3 #a1957b · border #322a1a · primary #c79a4e · primary-soft #2c2313 · accent #c4705a.
  - Derivar en armonía los tokens que falten y anotarlos con su nombre.
- **Escala de colores de división:** no es una paleta fija sino paramétrica `--div-1 … --div-N`, en registro heráldico apagado. Base en Pergamino: #3f7a6e · #2f5a8f · #6a4a8c · #b6532f · #9c3a5f · #bd7327 · #5f4a11 · #4a7a3a · #9c3a30; gris #7a7158 para divisiones sin número. En Claustro se aclaran. Anotar la regla de generación para N distinto de 9.

## 4. Artboards

Todos de 1440 px de ancho, escritorio; altura 1024 px, extensible si el contenido lo exige.

### 00 · Contrato de slots (esquema)
El shell dibujado en alambre, sin contenido, con cada región **numerada** y clasificada **FIJO** (plataforma, callout azul) o **SLOT** (materia, callout naranja); usar dos colores ajenos a la paleta. Esa misma numeración se repite en los callouts de todos los demás artboards. Regiones: (1) sello de plataforma en la cima del rail, (2) grupos fijos del rail, (3) grupos slot del rail, (4) botón plegar, (5) hero de materia, (6) rótulo y árbol del índice, (7) cabecera con pestañas, ⌘K, tema y avatar, (8) migas, (9) área de contenido, (10) columna derecha, (11) botón flotante. Debajo, el contrato escrito como texto: rail `{grupo, color, ítems:[{ruta, icono, etiqueta}]}`; hero `{nombre, código, institución}`; nomenclatura de división `{singular, abreviatura, plural, N}`; lista de tipos de página.

### 01 · Landing · Pergamino
Pantalla de plataforma, sin barras laterales.
1. **Cabecera de 40 px** (fondo surface con filete inferior): a la izquierda el **sello de Sinapsis** (círculo de 34 px en primary, aro interior de 1,5 px en accent, letra "S" en Fraunces itálica, color #f6efde) y "Sinapsis" en Fraunces 600 15 px; a la derecha buscador de 230–340 px con lupa, "Buscar materias, páginas…" y chip mono ⌘K; botón de tema; avatar de 24–28 px con iniciales "NA" y aro de 1 px en accent (sin foto). Variante lateral pequeña: menú del avatar abierto con "Nombre Apellido", "correo@dominio.com", "Cerrar sesión".
2. **Contenido** en columna de 1120 px centrada. Cabecera editorial calcada de `wiki-pergamino.png`: cintillo versalita "— MIS MATERIAS —" con filetes a los lados, h1 "Materias" en Fraunces 40 px, subtítulo mono "N materias · M cuatrimestres". A la derecha: botón primario relleno "Agregar materia" y botón secundario contorneado "Gestionar".
3. **Secciones de cuatrimestre**, la más reciente arriba: fila de cabecera igual a la fila de sección del catálogo (barra vertical de 3 px en accent, chip mono "C3", título Fraunces 22 px "Cuatrimestre 3 · 20XX", contador mono "3 materias", chevron para plegar). Debajo, grilla de 3 columnas (separación 16 px) de **tarjetas de materia**: surface, borde 1 px, radio 12, relieve, borde izquierdo de 3 px en el color de la materia; sello de 28 px con la inicial "M"; código mono "00.00" en text-3; "Materia N" en Hanken 600 15 px; "Institución" 11 px; barra de progreso fina con "0/00 páginas" en mono; metadatos "N divisiones · N páginas". Mostrar tres cuatrimestres: el primero con 3 tarjetas más la **tarjeta fantasma** de borde discontinuo "+ Agregar materia"; el segundo con 4 tarjetas (dos filas) mostrando los tres estados: 0 % "Sin comenzar", parcial y 100 % "Completa"; el tercero plegado.
4. Pie discreto en mono: "Sinapsis · v0.0". Fondo con grano.

### 01b · Landing · Gestión
La misma pantalla con "Gestionar" activo: barra "Editando · Guardar / Cancelar"; asa ⋮⋮ en cada tarjeta y en cada cabecera de cuatrimestre; una tarjeta a mitad de arrastre (elevada, rotada 1°) sobre su hueco de destino punteado; en otra tarjeta, botón "Quitar" (nota: pide confirmación y conserva el progreso) y selector "Cuatrimestre N ▾" para mover; al pie, "+ Agregar cuatrimestre". Superpuesto, el diálogo **"Agregar materia"** cuyos campos son exactamente el contrato de materia: Nombre, Código (00.00), Institución, Cuatrimestre, Color, Rótulo de división (singular / abreviatura / plural).

### 01c · Landing · vacía (variante pequeña)
Solo el contenido: cintillo, h1 y estado vacío "Todavía no hay materias" con botón "Agregar la primera materia".

### 01d · Landing · Claustro
01 en tema oscuro.

### 02 · Materia · Inicio · Pergamino (materia A, 5 divisiones)
El shell completo como en `inicio-pergamino.png`.
1. **Rail** de 52 px (fondo surface, filete derecho). Arriba, el **mismo sello "S"** de la landing, tooltip "Volver a Sinapsis" (región 1: FIJO). Debajo, botones de 36×36 px, radio 10, icono 18 px en text-3, grupos separados por filetes de 1 px (padding vertical 6, gap 2); el activo lleva fondo del color del grupo al 14 % y barra de 3×20 px pegada al borde izquierdo. Composición: grupo FIJO "Mi ruta" (Inicio, Plan, Kits); grupo FIJO "Consultar" (Todo el wiki, Grafo); dos grupos SLOT de tamaño distinto ("Grupo A" con 3 herramientas, "Grupo B" con 2), cada uno con color propio; un **slot vacío** (contorno discontinuo con "+", callout "slot sin rellenar: no se dibuja en producción"); grupo FIJO "Lo mío" (Apuntes, Favoritos); grupo FIJO "Wiki" (Índice, Registro). Al pie, botón de plegar. Iconos de los slots estrictamente abstractos (cuadrado, círculo, rombo, línea): ninguno que aluda a una disciplina.
2. **Panel índice** de 250 px (fondo bg). Hero (padding 9/12, filete inferior): "Materia" 13 px peso 650 y "00.00 · Institución" 10,5 px text-3. Rótulo versalita "DIVISIONES" (SLOT: rótulo configurable). Árbol de filas de 32 px: punto de color 8 px, "D1 · División 1" 12,5 px, contador mono en chip, chevron; cinco divisiones "División 1…5" más "Transversales" en gris. **D2 desplegada**: "Ver la división completa"; bloques por tipo con filete izquierdo de 2 px en el color de la división y rótulo pegajoso versalita "TIPO A · 3", "TIPO B · 2", "TIPO C · 1"; páginas "01 Título de la página"… con número mono, una marcada como leída y la 04 activa sobre primary-soft.
3. **Columna de contenido**: cabecera de 40 px con pestañas estilo Obsidian (activa con filete superior de 2 px en primary y cierre ×, botón "+"), buscador ⌘K, botón de tema (callout: "decisión pendiente: tema global o por materia") y avatar idéntico al de la landing. Migas de 28 px en 11,5 px text-3. Main en vista ancha de 1120 px: tarjeta "POR DÓNDE EMPEZAR" (versalita con icono, título Fraunces 22 px "Todavía no ha leído ninguna página", párrafo 14 px, botón primario "Empezar por División 1", secundario "Ver herramientas de la materia"); h1 "Progreso" Fraunces 40 px con "0 / 00 páginas" mono a la derecha; barra general; lista de divisiones con punto, nombre, barra de 260 px y "0/00"; tarjeta "REPASO DE HOY" recortada por el borde inferior, como en la referencia. Botón flotante circular de 44 px abajo a la derecha con icono abstracto (SLOT).

### 02b · Materia · Lector · Claustro (materia B, 14 semanas)
El mismo shell en tema oscuro con otra materia, para demostrar el índice adaptable: hero "Materia B / 00.00 · Institución"; rótulo "SEMANAS"; catorce filas "S01 · Semana 01"… con la escala de color paramétrica (callout: "N = 14 no sale de una paleta fija"); rail con un solo grupo SLOT de 4 herramientas. Contenido como `lector-claustro.png`: chips "Marcar estudiado" y "Guardar", migas en línea; hoja de 840 px (elevated #332b1b, radio 16, relieve, borde superior de 2 px en el color de la semana) con chip "S03 · Semana 03", chip mono "TIPO B", "página 3 de 10", "¿Qué sigue? ▾", "+N fuentes"; barra de segmentos por página con el actual resaltado; "← Anterior / Siguiente: Título de la página →"; h1 "Título de la página" Fraunces 40 px; dos párrafos neutros en Spectral 17 px con un enlace subrayado; h2 "Sección 1"; placa de fórmula casi negra (#1a1408, radio 12, barra izquierda de 3 px) con una expresión genérica f(x) = a·x + b; lista de viñetas. Columna derecha de 248 px: "EN ESTA PÁGINA" (TOC, activo con filete izquierdo de 2 px en primary), "FUENTES" (Fuente 1…3), "ENLAZAN AQUÍ (N)" (Página enlazada 1…3); pestaña vertical "PANEL" para plegarla.

### 02c · Materia · Índice plegado
02 con el panel de 250 px oculto: solo el rail de 52 px y el contenido recentrado.

### Opcional: 01 en Laurel, si el tiempo lo permite.

## 5. Reglas de placeholders

- Permitidos: "Sinapsis" (única marca visible), "Materia", "Materia N", "Materia A/B", "00.00" (se admite "00.01…" solo para distinguir tarjetas), "Institución", "Cuatrimestre N · 20XX", "División N" / "DN", "Semana NN" / "SNN", "Transversales", "Tipo A/B/C", "Título de la página", "Sección N", "Herramienta N", "Fuente N", "Página enlazada N", "Nombre Apellido", "NA", "correo@dominio.com".
- Cifras: ceros o letras ("0/00", "N", "M"), siempre en mono. Texto de relleno: frases neutras en español o lorem ipsum.
- Prohibido: nombres o códigos de materias reales, unidades temáticas, fórmulas reconocibles de una disciplina, docentes, fechas concretas, logotipos o siglas de instituciones, fotografías de personas, marcas de terceros, iconos que sugieran una disciplina.

## 6. Estandarización frente a flexibilidad

**FIJO de plataforma** (idéntico en toda materia): geometría del shell (rail 52 · panel 250 · cabecera 40 · migas 28 · hoja 840 · vista ancha 1120 · columna derecha 248); cabecera con pestañas, ⌘K, tema y avatar; sello "S" como vuelta a la landing; estructura del hero; mecánica del índice en tres niveles (división → bloque de tipo → página); grupos fijos del rail; hoja de lectura, migas y columna derecha; los tres temas, la tipografía y los componentes.

**SLOT de materia** (lo rellena el agente de cada materia bajo contrato): grupos intermedios del rail (cantidad, iconos, colores, orden); botón flotante; rótulo del árbol y palabra de división `{singular, abreviatura, plural}` y su N; tipos de página y su orden; escala de color derivada de N; tarjetas del Inicio distintas de "Progreso"; datos del hero.

## 7. Criterios de aceptación

- Buscar "Probabilidad", "93.24", "ITBA" y "Unidad" en todos los artboards devuelve cero resultados.
- 02 superpuesto a `inicio-pergamino.png` coincide en las medidas del shell (52 / 250 / 40 / 28 / 1120); 02b sobre `lector-claustro.png` coincide en 840 / 248.
- El sello "S" es idéntico en la landing y en la cima del rail; el avatar es idéntico en todos los artboards.
- Rail con fijos y slots distinguidos, grupos slot de tamaño distinto entre 02 y 02b, y un slot vacío visible.
- Índice con dos nomenclaturas distintas de "Unidad" (División 1…5 y Semana 01…14), una división desplegada hasta el nivel de página con estados leído y activo.
- Landing: tres cuatrimestres, al menos siete materias con los tres estados de progreso, tarjeta fantasma, modo gestión y diálogo "Agregar materia".
- Cada color usado existe como token nombrado; los tres temas presentes al menos una vez; contraste AA del texto sobre superficie en todos ellos. Ningún texto rasterizado.
- Callouts FIJO / SLOT numerados en todas las regiones, con la numeración del artboard 00.

## 8. Formato de entrega

- Artboards nombrados: `00 Contrato de slots`, `01 Landing · Pergamino`, `01b Landing · Gestión`, `01c Landing · vacía`, `01d Landing · Claustro`, `02 Materia · Inicio · Pergamino`, `02b Materia · Lector · Claustro`, `02c Materia · Índice plegado`.
- Capas agrupadas por región y nombradas como componentes en PascalCase: AppShell, Rail (subgrupos Fijo / Slot), RailItem, PlatformGlyph, IndexPanel, SubjectHero, DivisionGroup, TypeBlock, PageRow, TopBar, Tab, SearchButton, ThemeToggle, Avatar, Crumbs, ReadingSheet, FormulaPlate, TocCard, SourcesCard, BacklinksCard, Fab, SemesterSection, SubjectCard, AddSubjectCard, AddSubjectDialog.
- Componentes reutilizables con estado y tema como propiedades, instanciados en 01 y 02, para que el export se traduzca a React con props evidentes. Colores y tipografías como estilos nombrados.
- Capa "Anotaciones" ocultable (callouts, cotas de medidas en los márgenes de 02 y 02b, nombre del token junto a cada color), para exportar cada pantalla limpia o anotada. Exportable a PNG 2x y en formato editable.
- Al terminar, agregar una nota breve con las decisiones que este prompt no fijaba y que se tomaron durante el diseño.
