import { Text } from 'pixi.js';
import { SubtitleTextStyle } from '../../styles/TextStyles';
import { GameState } from '../../core/gameState';

/**
 * 상태 표시 컴포넌트 생성 함수
 */
export function createStatusDisplay(
  x: number,
  y: number,
  gameState: GameState
): Text {
  const statusText = new Text({
    text: `moves: ${gameState.moves}\ntime: ${gameState.time}s`,
    style: SubtitleTextStyle(48),
  });

  statusText.anchor.set(0.5);
  statusText.position.set(x, y);

  return statusText;
}

/**
 * 상태 표시 업데이트 함수
 */
export function updateStatusDisplay(
  statusText: Text,
  gameState: GameState,
  isComplete: boolean = false
): void {
  if (isComplete) {
    statusText.text = `완성!\nmoves: ${gameState.moves}\ntime: ${gameState.time}s`;
  } else {
    statusText.text = `moves: ${gameState.moves}\ntime: ${gameState.time}s`;
  }
}
