import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from "../pages/MainPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainPage />,
    },
  ],
  {
    basename: "/game/bini-puzzle-web",
  }
);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
