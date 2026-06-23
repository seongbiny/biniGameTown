import { Link, useParams } from 'react-router-dom';
import { getGameById } from '@biniverse/game-sdk';
import GamePlayer from '../components/game/GamePlayer.tsx';

export default function GamePlayPage() {
  const { id } = useParams<{ id: string }>();
  const module = id ? getGameById(id) : undefined;

  if (!module) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400">게임을 찾을 수 없습니다.</p>
        <Link to="/games" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`/games/${module.meta.id}`}
        className="w-fit text-sm text-gray-500 hover:text-gray-900"
      >
        ← {module.meta.title}으로 돌아가기
      </Link>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
        {id && <GamePlayer gameId={id} />}
      </div>
    </div>
  );
}
