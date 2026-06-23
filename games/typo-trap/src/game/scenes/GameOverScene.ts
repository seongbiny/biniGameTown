import { Container } from 'pixi.js';
import { createText } from '../ui/createText';
import { createButton } from '../ui/createButton';
import type { GameOverReason } from '../types';
import { GAME_CONFIG } from '../constants';

const REASON_TEXT: Record<GameOverReason, string> = {
  wrong: '오타가 없는 단어를 클릭했어요!',
  timeout: '시간이 다 됐어요!',
};

export class GameOverScene extends Container {
  constructor(reason: GameOverReason, onRestart: () => void) {
    super();

    const title = createText('Game Over', { fontSize: 72, fill: 0xff4444 });
    title.anchor.set(0.5);
    title.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    title.y = 180;

    const reasonText = createText(REASON_TEXT[reason], { fontSize: 26 });
    reasonText.anchor.set(0.5);
    reasonText.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    reasonText.y = 275;

    const btn = createButton('다시 시작', onRestart, { width: 200, height: 56, color: 0xcc3333 });
    btn.x = GAME_CONFIG.CANVAS_WIDTH / 2 - 100;
    btn.y = 400;

    this.addChild(title, reasonText, btn);
  }
}
