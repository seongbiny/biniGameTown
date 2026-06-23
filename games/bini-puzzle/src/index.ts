import type { GameModule } from '@biniverse/game-sdk';
import { BiniPuzzleGame } from './game/BiniPuzzleGame';

const binipuzzle: GameModule = {
  meta: {
    id: 'bini-puzzle',
    title: 'Bini Puzzle',
    description: '숫자 타일을 순서대로 맞춰라! 빈 칸을 이용해 퍼즐을 완성하세요.',
    categories: ['퍼즐', '전략'],
    thumbnail: '/thumbnails/bini-puzzle.svg',
    controls: [
      '빈 칸 옆에 있는 타일을 클릭하면 이동',
      '1~8 숫자를 순서대로 배열하면 클리어!',
      '최소 이동 횟수로 완성해보세요',
    ],
  },
  createGame: () => new BiniPuzzleGame(),
};

export default binipuzzle;
