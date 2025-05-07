export const DEFAULT_CONFIG = {};

// src/config/constants.ts
export const COLORS = {
  PRIMARY: 0x61b1ec, // 메인 배경색
  SECONDARY: 0xff7eb9, // 버튼 색상
  WHITE: 0xffffff, // 흰색
  BLACK: 0x000000, // 검은색
  BACKGROUND: 0x1a2b4c, // 퍼즐 배경색
  EASY: 0x06ff1b, // 쉬움 난이도 색상
  NORMAL: 0xffe606, // 보통 난이도 색상
  HARD: 0xd41e5b, // 어려움 난이도 색상
};

export const FONT = {
  FAMILY: 'Pixelify Sans',
  DEFAULT_SIZE: 28,
  TITLE_SIZE: 40,
  SUBTITLE_SIZE: 32,
};

export const BORDER_WIDTH = {
  DEFAULT: 3,
  CELL: 2,
};

export const DIFFICULTY = {
  EASY: { text: 'EASY', color: COLORS.EASY, gridSize: 3 },
  NORMAL: { text: 'NORMAL', color: COLORS.NORMAL, gridSize: 4 },
  HARD: { text: 'HARD', color: COLORS.HARD, gridSize: 5 },
};

export const ANIMATION = {
  DURATION: {
    SHORT: 0.1,
    MEDIUM: 0.3,
    LONG: 0.5,
  },
  EASE: {
    DEFAULT: 'power2.out',
    BOUNCE: 'bounce.out',
  },
};

export const GAME_WIDTH = 450;
export const GAME_HEIGHT = 800;
