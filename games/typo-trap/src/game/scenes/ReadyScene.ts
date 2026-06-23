import { Container } from 'pixi.js';
import { createText } from '../ui/createText';
import { createButton } from '../ui/createButton';
import { GAME_CONFIG } from '../constants';

export class ReadyScene extends Container {
  constructor(onStart: () => void) {
    super();

    const title = createText('Typo Trap', { fontSize: 64, fill: 0xffffff });
    title.anchor.set(0.5);
    title.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    title.y = 150;

    const desc1 = createText('3초 안에 오타가 있는 단어를 찾아라!', { fontSize: 28 });
    desc1.anchor.set(0.5);
    desc1.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    desc1.y = 270;

    const desc2 = createText('틀리면 바로 게임 오버!', { fontSize: 22, fill: 0xffcc44 });
    desc2.anchor.set(0.5);
    desc2.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    desc2.y = 313;

    const btn = createButton('시작하기', onStart, { width: 200, height: 56 });
    btn.x = GAME_CONFIG.CANVAS_WIDTH / 2 - 100;
    btn.y = 420;

    this.addChild(title, desc1, desc2, btn);
  }
}
