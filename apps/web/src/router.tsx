import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import GamesPage from './pages/GamesPage.tsx';
import GameDetailPage from './pages/GameDetailPage.tsx';
import GamePlayPage from './pages/GamePlayPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'games', element: <GamesPage /> },
      { path: 'games/:id', element: <GameDetailPage /> },
      { path: 'games/:id/play', element: <GamePlayPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
