import { Container, Graphics } from 'pixi.js';
import { createText } from '../ui/createText';
import { createButton } from '../ui/createButton';
import type { Stage } from '../types';
import { GAME_CONFIG } from '../constants';

const PROGRESS_BAR_X = 50;
const PROGRESS_BAR_Y = 80;
const PROGRESS_BAR_MAX_WIDTH = 700;
const PROGRESS_BAR_HEIGHT = 20;

const GRID_AVAILABLE_WIDTH = 700;
const GRID_AVAILABLE_HEIGHT = 420;
const GRID_GAP = 10;
const GRID_START_Y = 150;

export class PlayingScene extends Container {
  private progressBarFill: Graphics;

  constructor(
    stage: Stage,
    stageIndex: number,
    onSelectWord: (word: string) => void
  ) {
    super();

    // 단계 표시
    const stageLabel = createText(
      `${stageIndex + 1} / ${GAME_CONFIG.TOTAL_STAGE_COUNT}`,
      { fontSize: 26 }
    );
    stageLabel.anchor.set(0.5);
    stageLabel.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    stageLabel.y = 45;

    // 프로그레스 바 배경
    const progressBg = new Graphics();
    progressBg.roundRect(PROGRESS_BAR_X, PROGRESS_BAR_Y, PROGRESS_BAR_MAX_WIDTH, PROGRESS_BAR_HEIGHT, 4);
    progressBg.fill(0x444444);

    // 프로그레스 바 채움
    this.progressBarFill = new Graphics();
    this.drawProgressBar(GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS);

    // 그리드 계산
    const cols = Math.round(Math.sqrt(stage.options.length));
    const rows = Math.ceil(stage.options.length / cols);
    const btnWidth = Math.floor((GRID_AVAILABLE_WIDTH - (cols - 1) * GRID_GAP) / cols);
    const btnHeight = Math.floor((GRID_AVAILABLE_HEIGHT - (rows - 1) * GRID_GAP) / rows);
    const totalGridWidth = cols * btnWidth + (cols - 1) * GRID_GAP;
    const startX = (GAME_CONFIG.CANVAS_WIDTH - totalGridWidth) / 2;
    const fontSize = Math.max(16, 30 - (cols - 2) * 4);

    // 단어 버튼 그리드 배치
    const wordButtons = stage.options.map((word, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const btn = createButton(word, () => onSelectWord(word), {
        width: btnWidth,
        height: btnHeight,
        color: 0x334466,
        fontSize,
      });
      btn.x = startX + col * (btnWidth + GRID_GAP);
      btn.y = GRID_START_Y + row * (btnHeight + GRID_GAP);
      return btn;
    });

    this.addChild(stageLabel, progressBg, this.progressBarFill, ...wordButtons);
  }

  update(remainingTime: number): void {
    this.drawProgressBar(remainingTime);
  }

  private drawProgressBar(remainingTime: number): void {
    const ratio = Math.max(0, remainingTime / GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS);
    const width = PROGRESS_BAR_MAX_WIDTH * ratio;

    this.progressBarFill.clear();
    if (width > 0) {
      this.progressBarFill.roundRect(PROGRESS_BAR_X, PROGRESS_BAR_Y, width, PROGRESS_BAR_HEIGHT, 4);
      this.progressBarFill.fill(ratio > 0.4 ? 0x00cc66 : 0xff6633);
    }
  }
}
