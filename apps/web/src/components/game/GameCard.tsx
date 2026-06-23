import { Link } from 'react-router-dom';
import type { GameMeta } from '@biniverse/game-sdk';

interface GameCardProps {
  game: GameMeta;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-gray-900">{game.title}</h3>
        <p className="line-clamp-2 text-sm text-gray-500">{game.description}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {game.categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
