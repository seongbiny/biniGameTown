import { Container } from 'pixi.js';
import { createText } from '../ui/createText';
import { createButton } from '../ui/createButton';
import { GAME_CONFIG } from '../constants';

export class CorrectScene extends Container {
  constructor(onNext: () => void) {
    super();

    const title = createText('정답!', { fontSize: 72, fill: 0x00cc66 });
    title.anchor.set(0.5);
    title.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    title.y = 200;

    const sub = createText('다음 단계로 가볼까요?', { fontSize: 26 });
    sub.anchor.set(0.5);
    sub.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    sub.y = 295;

    const btn = createButton('다음 단계', onNext, { width: 200, height: 56, color: 0x00aa55 });
    btn.x = GAME_CONFIG.CANVAS_WIDTH / 2 - 100;
    btn.y = 400;

    this.addChild(title, sub, btn);
  }
}
