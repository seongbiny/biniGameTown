export enum GameStatus {
  MAIN = 'MAIN',
  SELECT_LEVEL = 'SELECT_LEVEL',
  SELECT_ARTIST = 'SELECT_ARTIST',
  SELECT_MEMBER = 'SELECT_MEMBER',
  READY = 'READY',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface GameState {
  status: GameStatus;
  gridSize?: number;
  selectedArtist?: 'njz' | 'meovv' | 'aespa' | 'blackpink';
  selectedMember?: string;
  moves?: number;
  time?: number;
}
