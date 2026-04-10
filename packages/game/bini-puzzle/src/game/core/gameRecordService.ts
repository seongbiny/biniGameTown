import { submitGameResult as postGameResult } from '@bini-game-town/shared';

/**
 * bini-puzzle 게임 결과를 부모 창(웹)으로 전송합니다.
 *
 * 내부적으로 shared의 submitGameResult(postMessage)를 사용하므로
 * 다른 게임들과 동일한 방식으로 점수가 저장됩니다.
 *
 * @param moves - 퍼즐 완성까지의 이동 횟수
 */
export const submitGameResult = (moves: number): void => {
  postGameResult('bini-puzzle', moves);
};
