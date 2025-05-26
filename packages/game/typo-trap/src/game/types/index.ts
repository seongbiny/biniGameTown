export const SceneType = {
  READY: "READY",
  PLAYING: "PLAYING",
  RESULT: "RESULT",
} as const;

export type SceneType = (typeof SceneType)[keyof typeof SceneType];
