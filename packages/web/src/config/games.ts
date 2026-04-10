import BiniPuzzlePanel from '@/assets/image/bini-puzzle-panel.svg';
import FlappyPlanePanel from '@/assets/image/flappy-plane-panel.svg';
import TypoTrapPanel from '@/assets/image/typo-trap-panel.svg';

import BiniPuzzleLogo from '@/assets/image/biniPuzzleLogo.svg';
import FlappyPlaneLogo from '@/assets/image/flappyPlaneLogo.svg';
import TypoTrapLogo from '@/assets/image/typoTrapLogo.svg';

import PuzzleIcon from '@/assets/icon/PuzzleIcon.svg';
import PlaneIcon from '@/assets/icon/PlaneIcon.svg';
import BombIcon from '@/assets/icon/BombIcon.svg';

// GameId의 단일 소스는 @bini-game-town/shared
// 새 게임 추가 시 shared의 GameId 타입만 수정하면 됩니다
export type { GameId } from '@bini-game-town/shared';

export interface GameMeta {
  id: GameId;
  title: string; // 패널 상단 타이틀 (예: BINI PUZZLE)
  description: string; // About 텍스트
  panelImage: string; // 패널 상단 이미지
  icon: string; // 타이틀 옆 아이콘
  logo: string; // 게임 목록 로고 이미지
  devPort: number; // 개발 서버 포트 (예: 5001)
}

export const gamesById: Record<GameId, GameMeta> = {
  'bini-puzzle': {
    id: 'bini-puzzle',
    title: 'BINI PUZZLE',
    description: 'BINI PUZZLE is a game where you need to solve a puzzle by moving the pieces.',
    panelImage: BiniPuzzlePanel,
    icon: PuzzleIcon,
    logo: BiniPuzzleLogo,
    devPort: 5001,
  },
  'flappy-plane': {
    id: 'flappy-plane',
    title: 'FLAPPY PLANE',
    description: 'FLAPPY PLANE is a game where you need to fly a plane through the obstacles.',
    panelImage: FlappyPlanePanel,
    icon: PlaneIcon,
    logo: FlappyPlaneLogo,
    devPort: 5002,
  },
  'typo-trap': {
    id: 'typo-trap',
    title: 'TYPO TRAP',
    description: 'TYPO TRAP is a game where you need to avoid the traps.',
    panelImage: TypoTrapPanel,
    icon: BombIcon,
    logo: TypoTrapLogo,
    devPort: 5003,
  },
};
