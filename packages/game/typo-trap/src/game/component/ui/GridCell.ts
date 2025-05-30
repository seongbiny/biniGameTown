import { Container, Graphics, Text } from "pixi.js";

export interface GridCellConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  word: string;
  fontSize: number;
  row: number;
  col: number;
}

export interface GridCellCallbacks {
  onCellClick: (row: number, col: number, cell: GridCell) => void;
}

export const CellState = {
  DEFAULT: "default",
  SELECTED: "selected",
  CORRECT: "correct",
  WRONG: "wrong",
} as const;

export type CellState = (typeof CellState)[keyof typeof CellState];

export interface CellStyle {
  backgroundColor: number;
  borderColor: number;
  borderWidth: number;
  borderRadius: number;
}

export class GridCell extends Container {
  private background!: Graphics;
  private textElement!: Text;
  private config: GridCellConfig;
  private callbacks: GridCellCallbacks;
  private cellState: CellState = CellState.DEFAULT;

  // 스타일 정의
  private readonly styles: Record<CellState, CellStyle> = {
    [CellState.DEFAULT]: {
      backgroundColor: 0xffffff,
      borderColor: 0xe9e9e9,
      borderWidth: 1,
      borderRadius: 20,
    },
    [CellState.SELECTED]: {
      backgroundColor: 0xffffff,
      borderColor: 0x000000,
      borderWidth: 3,
      borderRadius: 20,
    },
    [CellState.CORRECT]: {
      backgroundColor: 0xffffff,
      borderColor: 0x000000,
      borderWidth: 3,
      borderRadius: 20,
    },
    [CellState.WRONG]: {
      backgroundColor: 0xffffff,
      borderColor: 0xf69f9f, // 연분홍색
      borderWidth: 3,
      borderRadius: 20,
    },
  };

  constructor(config: GridCellConfig, callbacks: GridCellCallbacks) {
    super();
    this.config = config;
    this.callbacks = callbacks;

    this.createCell();
    this.setupInteraction();
  }

  private createCell(): void {
    // 배경 생성
    this.background = new Graphics();
    this.addChild(this.background);

    // 텍스트 생성
    this.textElement = new Text({
      text: this.config.word,
      style: {
        fontFamily: "Pretendard",
        fontSize: this.config.fontSize,
        fill: 0x000000,
        align: "center",
        fontWeight: "700",
      },
    });
    this.textElement.anchor.set(0.5);
    this.textElement.x = this.config.width / 2;
    this.textElement.y = this.config.height / 2;
    this.addChild(this.textElement);

    // 위치 설정
    this.x = this.config.x;
    this.y = this.config.y;

    // 초기 스타일 적용
    this.applyStyle(CellState.DEFAULT);
  }

  private setupInteraction(): void {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      this.onClick();
    });
  }

  private onClick(): void {
    console.log(
      `🎯 GridCell clicked: (${this.config.row}, ${this.config.col})`
    );
    this.callbacks.onCellClick(this.config.row, this.config.col, this);
  }

  public setState(state: CellState): void {
    if (this.cellState === state) return;

    this.cellState = state;
    this.applyStyle(state);

    console.log(
      `🎨 GridCell (${this.config.row}, ${this.config.col}) state changed to: ${state}`
    );
  }

  public getState(): CellState {
    return this.cellState;
  }

  public getPosition(): { row: number; col: number } {
    return { row: this.config.row, col: this.config.col };
  }

  public getWord(): string {
    return this.config.word;
  }

  private applyStyle(state: CellState): void {
    const style = this.styles[state];

    this.background.clear();
    this.background.roundRect(
      0,
      0,
      this.config.width,
      this.config.height,
      style.borderRadius
    );
    this.background.fill(style.backgroundColor);
    this.background.stroke({
      width: style.borderWidth,
      color: style.borderColor,
    });
  }

  public enableInteraction(): void {
    this.eventMode = "static";
    this.cursor = "pointer";
  }

  public disableInteraction(): void {
    this.eventMode = "none";
    this.cursor = "default";
  }

  public reset(): void {
    this.setState(CellState.DEFAULT);
    this.enableInteraction();
  }

  public updateWord(word: string): void {
    this.config.word = word;
    this.textElement.text = word;
  }

  public updateFontSize(fontSize: number): void {
    this.config.fontSize = fontSize;
    this.textElement.style.fontSize = fontSize;
  }

  // 디버깅을 위한 메서드
  public getDebugInfo(): string {
    return `GridCell(${this.config.row}, ${this.config.col}): "${this.config.word}" [${this.cellState}]`;
  }
}
