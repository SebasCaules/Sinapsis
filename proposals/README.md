# proposals/

Propuestas de cambio a la plataforma hechas por las materias (contrato N0-44,
`docs/PROPOSALS.md`).

- `AAAA-MM-DD-<materia>-<titulo>.md` — una propuesta, con el formato de `PLANTILLA.md`. La
  escribe `sinapsis propose` en la rama `proposal/<materia>-<AAAAMMDD>-<titulo>`; llega a
  `main` solo si el orquestador la aprueba y la mergea.
- `INBOX.md` — el índice, siempre en `main`: las abiertas arriba, las adjudicadas abajo.
- `PLANTILLA.md` — el formato, para leerlo; no se copia a mano.

Quien propone: el agente de la materia, con `/sinapsis` → `propose`. Quien adjudica: el
orquestador, con `/sinapsis-review`. Nadie mergea su propia propuesta.

Esta carpeta es **solo para cambios a la plataforma**. El contenido de una materia entra por
otro camino: `sinapsis publish` abre un pull request desde una rama `subject/<slug>-<fecha>`
que toca únicamente `subjects/<slug>/`, sin archivo acá y sin fila en el INBOX. Lo adjudica el
mismo `/sinapsis-review`, con los criterios de `docs/contracts/07-propuestas.md` §5.
