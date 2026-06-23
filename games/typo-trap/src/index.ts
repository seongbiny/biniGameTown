import type { GameModule } from '@biniverse/game-sdk';
import { TypoTrapGame } from './game/TypoTrapGame';

const typotrap: GameModule = {
  meta: {
    id: 'typo-trap',
    title: 'Typo Trap',
    description: '화면에 나타나는 단어 중 오타가 있는 것을 3초 안에 찾아라!',
    categories: ['타이핑', '아케이드'],
    thumbnail: '/thumbnails/typo-trap.svg',
    controls: [
      '마우스로 오타가 있는 단어를 클릭하세요',
      '3초 안에 찾지 못하면 게임 오버!',
      '오타가 없는 단어를 클릭해도 게임 오버!',
    ],
  },
  createGame: () => new TypoTrapGame(),
};

export default typotrap;
