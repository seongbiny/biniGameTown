export const SceneType = {
  READY: "READY",
  PLAYING: "PLAYING",
  RESULT: "RESULT",
} as const;

export type SceneType = (typeof SceneType)[keyof typeof SceneType];

export const GameStatus = {
  WAITING: "WAITING",
  PLAYING: "PLAYING",
  FINISHED: "FINISHED",
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export interface StageInfo {
  stage: number;
  gridSize: number;
  wordCount: number;
}

export interface WordData {
  id: string;
  text: string;
  isCorrect: boolean;
  position: {
    row: number;
    col: number;
  };
}

export interface GridData {
  stage: number;
  size: number;
  words: WordData[];
  correctWordId: string;
}

export interface GameState {
  status: GameStatus;
  currentStage: number;
  timeLeft: number;
  reachedStage: number;
}

export const GAME_CONFIG = {
  STAGE_COUNT: 4,
  TIME_LIMIT: 5000,
  GRID_SIZES: [2, 3, 4, 5],
} as const;
