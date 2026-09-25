# Material de estudio de Sinapsis

Esta carpeta la genera `study-app/scripts/export-sinapsis.mjs` a partir de `study-app/public/data/kit.json`
y `plan.json`. **No se edita a mano**: se corrige la wiki, se corre `npm run build` en `study-app/` y después
`node scripts/export-sinapsis.mjs`.

Los ids de las tarjetas y de las preguntas son fijos (`{#id}`), así que regenerar no borra el repaso espaciado.
