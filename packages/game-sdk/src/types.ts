export interface GameMeta {
  id: string;
  title: string;
  description: string;
  categories: string[];
  thumbnail: string;
  controls: string[];
}

export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  destroy: () => void;
  pause?: () => void;
  resume?: () => void;
}

export interface GameModule {
  meta: GameMeta;
  createGame: () => GameInstance;
}
