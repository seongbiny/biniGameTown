import type { GameModule } from '@biniverse/game-sdk';
import { FlappyBirdGame } from './game/FlappyBirdGame';

const flappybird: GameModule = {
  meta: {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: '장애물을 피해 최대한 멀리 날아가라! 스페이스바 또는 클릭으로 점프.',
    categories: ['아케이드', '반응속도'],
    thumbnail: '/thumbnails/flappy-bird.svg',
    controls: [
      '스페이스바 또는 화면 클릭으로 점프',
      '파이프에 닿으면 게임 오버!',
      '파이프를 통과할 때마다 점수 획득',
    ],
  },
  createGame: () => new FlappyBirdGame(),
};

export default flappybird;
