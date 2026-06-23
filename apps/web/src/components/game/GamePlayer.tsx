import { useEffect, useRef, useState } from 'react';
import { getGameById, type GameInstance } from '@biniverse/game-sdk';

interface GamePlayerProps {
  gameId: string;
}

export default function GamePlayer({ gameId }: GamePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const module = getGameById(gameId);
    if (!module) {
      setError(`게임을 찾을 수 없습니다: ${gameId}`);
      setIsLoading(false);
      return;
    }

    let instance: GameInstance | null = null;
    let destroyed = false;

    const start = async () => {
      try {
        const newInstance = module.createGame();
        await newInstance.init(container);

        if (destroyed) {
          // cleanup이 init보다 먼저 실행된 경우 — 완전히 초기화된 앱을 즉시 정리
          newInstance.destroy();
          return;
        }

        instance = newInstance;
        instance.start();
        setIsLoading(false);
      } catch {
        if (!destroyed) {
          setError('게임을 불러오는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      }
    };

    void start();

    return () => {
      destroyed = true;
      instance?.destroy();
    };
  }, [gameId]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <span className="text-sm text-white">로딩 중...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}
    </div>
  );
}
