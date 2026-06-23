import type { GameModule } from './types.js';

const games: GameModule[] = [];

export function registerGames(modules: GameModule[]): void {
  games.push(...modules);
}

export function getGameById(id: string): GameModule | undefined {
  return games.find((game) => game.meta.id === id);
}

export function getAllGames(): GameModule[] {
  return [...games];
}
