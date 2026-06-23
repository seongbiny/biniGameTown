import type { GameMeta } from '@biniverse/game-sdk';
import GameCard from './GameCard.tsx';

interface GameGridProps {
  games: GameMeta[];
}

export default function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <p className="py-16 text-center text-gray-400">등록된 게임이 없습니다.</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <li key={game.id}>
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  );
}
