import { Link, useParams } from 'react-router-dom';
import { getGameById } from '@biniverse/game-sdk';

export default function GameDetailPage() {
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

  const { meta } = module;

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-xl bg-gray-100">
        <img
          src={meta.thumbnail}
          alt={meta.title}
          className="h-64 w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">{meta.title}</h1>
            <div className="flex flex-wrap gap-1">
              {meta.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <Link
            to={`/games/${meta.id}/play`}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            게임 시작
          </Link>
        </div>

        <p className="text-gray-600">{meta.description}</p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">조작법</h2>
          <ul className="flex flex-col gap-1">
            {meta.controls.map((control) => (
              <li key={control} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">•</span>
                {control}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
