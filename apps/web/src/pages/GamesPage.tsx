import { getAllGames } from '@biniverse/game-sdk';
import GameGrid from '../components/game/GameGrid.tsx';

export default function GamesPage() {
  const games = getAllGames().map((module) => module.meta);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-900">게임 목록</h1>
      <GameGrid games={games} />
    </div>
  );
}
