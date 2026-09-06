-- Sinapsis · fechas de las instancias del plan de estudio.
--
-- El plan de una materia declara sus instancias evaluatorias
-- (`Plan.instances[]`: parcialito1, parcial, recuperatorio, final…) y el
-- cronograma puede traer una fecha por defecto, pero la fecha real la carga
-- cada persona: en la app original vivía en `localStorage` y acá vive en la
-- cuenta, así el plan dice lo mismo desde cualquier dispositivo.
--
-- Una fila por (usuario, materia, instancia). La clave NO se valida contra el
-- material: como las tareas y las tarjetas, el plan vive dentro de un JSON que
-- se re-sincroniza, y una instancia que hoy no está puede volver mañana con su
-- fecha intacta. Lo que sí se valida es el formato (`StudyId` en la ruta,
-- `PlanDate` AAAA-MM-DD en el cuerpo).
--
-- Las fechas son deliberadamente independientes del progreso: «Reiniciar el
-- plan» (DELETE .../tasks) borra las tareas tildadas y no toca esta tabla;
-- «Borrar fechas» (DELETE .../study/plan-dates) hace lo inverso.

CREATE TABLE IF NOT EXISTS plan_dates (
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  key         TEXT NOT NULL,
  date        TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (user_id, subject_id, key)
);
