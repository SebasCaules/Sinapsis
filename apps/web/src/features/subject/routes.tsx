/**
 * Rutas de una materia. El shell es el layout; las vistas son sus hijas.
 * Las pesadas (lector, catálogo, división, grafo) llegan en diferido: la primera
 * pantalla de una materia no paga el pipeline de markdown, ni KaTeX, ni d3.
 *
 * Las rutas de estudio (plan, kits, flashcards, quiz) viven en `study/routes.tsx`
 * y se montan acá con un solo `...studyRoutes`: el shell no tiene que conocer ni
 * una de ellas por su nombre.
 */
import { Suspense, lazy } from "react";
import { useParams, type RouteObject } from "react-router-dom";
import { studyRoutes } from "./study/routes";
import { SubjectShell } from "./SubjectShell";
import { ComingSoon, NotFoundInSubject, SheetSkeleton, WideSkeleton } from "./components/States";
import { useSubjectCtx } from "./context";
import { HomeView } from "./views/HomeView";

const ReaderView = lazy(() => import("./views/ReaderView"));
const CatalogView = lazy(() => import("./views/CatalogView"));
const DivisionView = lazy(() => import("./views/DivisionView"));
const GraphView = lazy(() => import("./views/GraphView"));
const FavoritesView = lazy(() => import("./views/FavoritesView"));
const NotesView = lazy(() => import("./views/NotesView"));

/** «Próximamente» con el nombre real que la materia le dio a la herramienta. */
function ToolView() {
  const { model } = useSubjectCtx();
  const { tool = "" } = useParams();
  /* El mismo buscador que usa el shell para la pestaña: una sola definición de
     «qué ítem del rail corresponde a /t/:tool». */
  const view = model.railItem(tool);
  if (!view) return <ComingSoon title="Herramienta de la materia" sprint="Sprint 3" />;
  return <ComingSoon title={view.item.label} sprint="Sprint 3" />;
}

function SubjectNotFound() {
  const { subject = "" } = useParams();
  return <NotFoundInSubject subject={subject} />;
}

export const subjectRoutes: RouteObject[] = [
  {
    path: "/m/:subject",
    element: <SubjectShell />,
    children: [
      { index: true, element: <HomeView /> },
      {
        path: "wiki",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <CatalogView />
          </Suspense>
        ),
      },
      {
        path: "graph",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <GraphView />
          </Suspense>
        ),
      },
      {
        path: "favorites",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <FavoritesView />
          </Suspense>
        ),
      },
      {
        path: "notes",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <NotesView />
          </Suspense>
        ),
      },
      /* Plan, kits, flashcards y quiz: rutas relativas que aporta `study/`. */
      ...studyRoutes,
      {
        path: "d/:division",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <DivisionView />
          </Suspense>
        ),
      },
      {
        path: "p/:page",
        element: (
          <Suspense fallback={<SheetSkeleton />}>
            <ReaderView />
          </Suspense>
        ),
      },
      { path: "t/:tool", element: <ToolView /> },
      { path: "*", element: <SubjectNotFound /> },
    ],
  },
];
