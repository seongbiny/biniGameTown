export const SceneType = {
  READY: "READY",
  PLAYING: "PLAYING",
  RESULT: "RESULT",
} as const;

export type SceneType = (typeof SceneType)[keyof typeof SceneType];

export const PlayingState = {
  PLAYING: "playing",
  SUCCESS: "success",
  TIMEOUT: "timeout",
  WRONG: "wrong",
} as const;

export type PlayingState = (typeof PlayingState)[keyof typeof PlayingState];
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

export const GAME_CONFIG = {
  STAGE_COUNT: 4,
  TIME_LIMIT: 5000,
  GRID_SIZES: [2, 3, 4, 5],
} as const;
