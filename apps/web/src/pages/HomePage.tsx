import { Link } from 'react-router-dom';
import { getAllGames } from '@biniverse/game-sdk';
import GameGrid from '../components/game/GameGrid.tsx';

export default function HomePage() {
  const games = getAllGames().map((module) => module.meta);

  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col items-center gap-6 py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Biniverse
        </h1>
        <p className="max-w-md text-lg text-gray-500">
          직접 만든 미니게임을 한 곳에서 즐겨보세요.
        </p>
        <Link
          to="/games"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          게임 목록 보기
        </Link>
      </section>

      {games.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-900">게임</h2>
          <GameGrid games={games} />
        </section>
      )}
    </div>
  );
}
