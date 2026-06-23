import type { GameModule } from '@biniverse/game-sdk';
import typotrap from '@biniverse/typo-trap';

// 게임 패키지가 이식되면 import 후 배열에 추가
// import flappybird from '@biniverse/flappy-bird';
// import binipuzzle from '@biniverse/bini-puzzle';

const gameModules: GameModule[] = [
  typotrap,
  // flappybird,
  // binipuzzle,
];

export default gameModules;
