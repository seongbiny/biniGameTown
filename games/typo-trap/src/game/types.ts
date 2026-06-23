// GameInstance는 @biniverse/game-sdk에서 관리
export type GameStatus = 'ready' | 'playing' | 'correct' | 'gameOver' | 'clear';

export type GameOverReason = 'wrong' | 'timeout';

export interface Stage {
  id: number;
  answer: string;
  options: string[];
}
