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
import { NotFoundInSubject, SheetSkeleton, WideSkeleton } from "./components/States";
import { HomeView } from "./views/HomeView";

const ReaderView = lazy(() => import("./views/ReaderView"));
const CatalogView = lazy(() => import("./views/CatalogView"));
const DivisionView = lazy(() => import("./views/DivisionView"));
const GraphView = lazy(() => import("./views/GraphView"));
const FavoritesView = lazy(() => import("./views/FavoritesView"));
const NotesView = lazy(() => import("./views/NotesView"));
/* El anfitrión de las herramientas de la materia (Sprint 3). Llega en diferido:
   una materia sin bundles no paga ni un byte de él. */
const ToolHost = lazy(() => import("./tools/ToolHost"));

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
      {
        path: "t/:tool",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <ToolHost />
          </Suspense>
        ),
      },
      { path: "*", element: <SubjectNotFound /> },
    ],
  },
];
