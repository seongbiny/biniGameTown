import { Container } from 'pixi.js';
import { createText } from '../ui/createText';
import { createButton } from '../ui/createButton';
import { GAME_CONFIG } from '../constants';

export class ClearScene extends Container {
  constructor(onRestart: () => void) {
    super();

    const title = createText('Clear!', { fontSize: 72, fill: 0xffd700 });
    title.anchor.set(0.5);
    title.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    title.y = 180;

    const sub = createText('모든 오타를 피해냈어요!', { fontSize: 26 });
    sub.anchor.set(0.5);
    sub.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    sub.y = 275;

    const btn = createButton('다시 시작', onRestart, { width: 200, height: 56, color: 0xcc8800 });
    btn.x = GAME_CONFIG.CANVAS_WIDTH / 2 - 100;
    btn.y = 400;

    this.addChild(title, sub, btn);
  }
}
