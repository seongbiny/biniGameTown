import { Container, Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { GAME_CONFIG } from "../../types";

export class PlayingScene extends Scene {
  private progressBarContainer!: Container;
  private progressBarBg!: Graphics;
  private progressBarFill!: Graphics;

  private gridContainer!: Container;
  private gridCells: Container[] = [];

  private currentStage: number = 1;

  private readonly STAGE_GAPS = [10, 7, 5, 3];

  private timer: number = 0;
  private timeLeft: number = GAME_CONFIG.TIME_LIMIT;
  private isTimerRunning: boolean = false;

  private readonly STAGE_WORDS: string[][][] = [
    [
      ["재촉", "재쵹"],
      ["재촉", "재촉"],
    ],
    [
      ["훈민정음", "훈민정음", "훈민정음"],
      ["훈민정음", "훈민정음", "훈민정음"],
      ["훈민정음", "훈민정음", "휸민정음"],
    ],
    [
      ["대한민국", "대한민국", "데한민국", "대한민국"],
      ["대한민국", "대한민국", "대한민국", "대한민국"],
      ["대한민국", "대한민국", "대한민국", "대한민국"],
      ["대한민국", "대한민국", "대한민국", "대한민국"],
    ],
    [
      [
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
      ],
      [
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
      ],
      [
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
      ],
      [
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
      ],
      [
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "대한\n민국\n만세",
        "댸한\n민국\n만세",
        "대한\n민국\n만세",
      ],
    ],
  ];

  public initialize(): void {
    super.initialize();

    this.createProgressBar();
    this.createGrid();
    this.startTimer();
  }

  private createProgressBar(): void {
    this.progressBarContainer = new Container();
    this.addChild(this.progressBarContainer);

    this.progressBarContainer.x = (this.screenWidth - 345) / 2;
    this.progressBarContainer.y = 34;

    this.progressBarBg = new Graphics();
    this.progressBarBg.rect(0, 0, 345, 10);
    this.progressBarBg.fill(0xd9d9d9);

    this.progressBarFill = new Graphics();
    this.progressBarContainer.addChild(
      this.progressBarBg,
      this.progressBarFill
    );

    this.updateProgressBar();
  }

  private createGrid(): void {
    this.gridContainer = new Container();
    this.addChild(this.gridContainer);

    this.gridContainer.x = (this.screenWidth - 400) / 2;
    this.gridContainer.y = (this.screenHeight - 500) / 2;

    this.createGridForStage(this.currentStage);
  }

  private createGridForStage(stage: number): void {
    this.clearGrid();

    const gridSize = GAME_CONFIG.GRID_SIZES[stage - 1];
    const gap = this.STAGE_GAPS[stage - 1];

    const cellWidth = (400 - gap * (gridSize - 1)) / gridSize;
    const cellHeight = (500 - gap * (gridSize - 1)) / gridSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * (cellWidth + gap);
        const y = row * (cellHeight + gap);
        const word = this.STAGE_WORDS[stage - 1][row][col];

        const cell = this.createGridCell(
          x,
          y,
          cellWidth,
          cellHeight,
          row,
          col,
          word
        );
        this.gridContainer.addChild(cell);
        this.gridCells.push(cell);
      }
    }
  }

  private createGridCell(
    x: number,
    y: number,
    width: number,
    height: number,
    row: number,
    col: number,
    word: string
  ): Container {
    const bg = new Graphics();
    bg.roundRect(0, 0, width, height, 20);
    bg.fill(0xffffff);
    bg.stroke({ width: 2, color: 0xe9e9e9 });

    const text = new Text({
      text: word,
      style: {
        fontSize: 24,
        fill: 0x000000,
        align: "center",
        fontWeight: "bold",
      },
    });
    text.anchor.set(0.5);
    text.x = width / 2;
    text.y = height / 2;

    const container = new Container();
    container.addChild(bg, text);
    container.x = x;
    container.y = y;

    container.eventMode = "static";
    container.cursor = "pointer";

    container.on("pointerdown", () => {
      this.onCellClick(row, col);
    });

    (container as any).gridPosition = { row, col };

    return container;
  }

  private onCellClick(row: number, col: number): void {
    console.log(`🎯 Cell selected: (${row}, ${col})`);

    // TODO: 여기에 정답/오답 체크 로직 추가
    // 현재는 디버그용 로그만 출력
  }

  private nextStage(): void {
    if (this.currentStage < GAME_CONFIG.STAGE_COUNT) {
      this.currentStage++;
      this.createGridForStage(this.currentStage);
      console.log(`⬆️ Advanced to stage ${this.currentStage}`);
    } else {
      console.log("🎉 All stages completed!");
    }
  }

  private clearGrid(): void {
    this.gridCells.forEach((cell) => {
      this.gridContainer.removeChild(cell);
      cell.destroy();
    });
    this.gridCells = [];
  }

  private updateProgressBar(): void {
    this.progressBarFill.clear();

    const progress = Math.max(0, this.timeLeft / GAME_CONFIG.TIME_LIMIT);
    const fillWidth = 345 * progress;

    if (fillWidth > 0) {
      this.progressBarFill.rect(0, 0, fillWidth, 10);
      this.progressBarFill.fill(0x000000);
    }
  }

  private startTimer(): void {
    this.stopTimer();

    this.timeLeft = GAME_CONFIG.TIME_LIMIT;
    this.isTimerRunning = true;

    this.timer = window.setInterval(() => {
      this.timeLeft -= 100;
      this.updateProgressBar();
    }, 100);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
    this.isTimerRunning = false;
  }

  private onTimerOut(): void {
    this.stopTimer();

    // TODO: 여기에 시간 초과 로직 추가
    // 예: 게임 상태를 'timeout'으로 변경
  }

  public reset(): void {
    super.reset();
    this.stopTimer();
    this.timeLeft = GAME_CONFIG.TIME_LIMIT;
    if (this.progressBarFill) {
      this.updateProgressBar();
    }
  }

  public pause(): void {
    super.pause();
    this.stopTimer();
    console.log("⏸️ PlayingScene paused");
  }

  public resume(): void {
    super.resume();
    if (this.timeLeft > 0) {
      this.startTimer();
    }
    console.log("▶️ PlayingScene resumed");
  }

  /**
   * 매 프레임마다 호출되는 업데이트 (필요시 사용)
   */
  public update(_deltaTime: number): void {
    super.update(_deltaTime);
    // 현재는 타이머로 처리하므로 특별한 업데이트 로직 없음
  }
}
