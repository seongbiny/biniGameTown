import { Container, Graphics, Text } from "pixi.js";
import { GAME_CONFIG } from "../../types";

export interface Position {
  row: number;
  col: number;
}

export interface StageConfig {
  correctWord: string;
  typoWord: string;
  gridSize: number;
}

export interface GameGridCallbacks {
  onCellClick: (row: number, col: number) => void;
}

export interface GameGridConfig {
  width: number;
  height: number;
  x: number;
  y: number;
}

export class GameGrid extends Container {
  private gridCells: Container[] = [];
  private selectedCell: Container | null = null;
  private currentStage: number = 1;
  private isInteractionEnabled: boolean = true;

  private stageWords: string[][][] = [];
  private correctPositions: Position[] = [];

  private callbacks: GameGridCallbacks;
  private config: GameGridConfig;

  private readonly STAGE_GAPS = [10, 7, 5, 3, 3];
  private readonly STAGE_FONT_SIZES = [32, 28, 24, 20, 18];
  private readonly STAGE_BASE_DATA: StageConfig[] = [
    { correctWord: "재촉", typoWord: "재쵹", gridSize: 2 },
    { correctWord: "훈민정음", typoWord: "휸민정음", gridSize: 3 },
    { correctWord: "세종대왕", typoWord: "새종대왕", gridSize: 4 },
    {
      correctWord: "대한\n민국\n만세",
      typoWord: "댸한\n민국\n만세",
      gridSize: 5,
    },
    {
      correctWord: "개미\n허리\n왕잠\n자리",
      typoWord: "걔미\n허리\n왕잠\n자리",
      gridSize: 5,
    },
  ];

  constructor(config: GameGridConfig, callbacks: GameGridCallbacks) {
    super();
    this.config = config;
    this.callbacks = callbacks;

    this.x = config.x;
    this.y = config.y;

    this.generateRandomizedStageWords();
  }

  private generateRandomizedStageWords(): void {
    this.stageWords = [];
    this.correctPositions = [];

    this.STAGE_BASE_DATA.forEach((stageData) => {
      const { correctWord, typoWord, gridSize } = stageData;

      // 모든 셀을 정답 단어로 채우기
      const grid: string[][] = [];
      for (let row = 0; row < gridSize; row++) {
        const rowData: string[] = [];
        for (let col = 0; col < gridSize; col++) {
          rowData.push(correctWord);
        }
        grid.push(rowData);
      }

      // 랜덤 위치 선택하고 틀린 단어 배치
      const randomRow = Math.floor(Math.random() * gridSize);
      const randomCol = Math.floor(Math.random() * gridSize);
      grid[randomRow][randomCol] = typoWord;

      // 결과 저장
      this.stageWords.push(grid);
      this.correctPositions.push({ row: randomRow, col: randomCol });
    });

    console.log("🎯 GameGrid 정답 위치 생성:", this.correctPositions);
  }

  public getCorrectPositions(): Position[] {
    return this.correctPositions;
  }

  public createForStage(stage: number): void {
    this.currentStage = stage;
    this.clearGrid();

    const gridSize = GAME_CONFIG.GRID_SIZES[stage - 1];
    const gap = this.STAGE_GAPS[stage - 1];

    const cellWidth = (this.config.width - gap * (gridSize - 1)) / gridSize;
    const cellHeight = (this.config.height - gap * (gridSize - 1)) / gridSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * (cellWidth + gap);
        const y = row * (cellHeight + gap);
        const word = this.stageWords[stage - 1][row][col];

        const cell = this.createGridCell(
          x,
          y,
          cellWidth,
          cellHeight,
          row,
          col,
          word,
          stage
        );
        this.addChild(cell);
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
    word: string,
    stage: number
  ): Container {
    const bg = new Graphics();
    bg.roundRect(0, 0, width, height, 20);
    bg.fill(0xffffff);
    bg.stroke({ width: 1, color: 0xe9e9e9 });

    const fontSize = this.STAGE_FONT_SIZES[stage - 1];

    const text = new Text({
      text: word,
      style: {
        fontFamily: "Pretendard",
        fontSize: fontSize,
        fill: 0x000000,
        align: "center",
        fontWeight: "700",
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
      this.onCellClick(row, col, container);
    });

    (container as any).gridPosition = { row, col };
    (container as any).background = bg;
    (container as any).cellDimensions = { width, height };

    return container;
  }

  private onCellClick(
    row: number,
    col: number,
    cellContainer: Container
  ): void {
    if (!this.isInteractionEnabled) {
      console.log("🚫 그리드 상호작용이 비활성화됨");
      return;
    }

    console.log(`🎯 GameGrid cell clicked: (${row}, ${col})`);

    this.updateCellSelection(cellContainer);
    this.callbacks.onCellClick(row, col);
  }

  private updateCellSelection(newSelectedCell: Container): void {
    if (this.selectedCell) {
      this.resetCellStyle(this.selectedCell);
    }

    this.applyCellSelectedStyle(newSelectedCell);
    this.selectedCell = newSelectedCell;
  }

  public enableInteraction(): void {
    this.isInteractionEnabled = true;
    this.gridCells.forEach((cell) => {
      cell.eventMode = "static";
      cell.cursor = "pointer";
    });
    console.log("✅ GameGrid 상호작용 활성화");
  }

  public disableInteraction(): void {
    this.isInteractionEnabled = false;
    this.gridCells.forEach((cell) => {
      cell.eventMode = "none";
      cell.cursor = "default";
    });
    console.log("❌ GameGrid 상호작용 비활성화");
  }

  public highlightWrongAndCorrectCells(
    selectedPos: Position,
    correctPos: Position
  ): void {
    this.gridCells.forEach((cell) => {
      const position = (cell as any).gridPosition;

      if (
        position.row === selectedPos.row &&
        position.col === selectedPos.col
      ) {
        // 선택한 셀 (틀린 답) - 연분홍색
        this.applyCellWrongStyle(cell);
      } else if (
        position.row === correctPos.row &&
        position.col === correctPos.col
      ) {
        // 정답 셀 - 검은색
        this.applyCellCorrectStyle(cell);
      } else {
        // 나머지 셀들은 기본 스타일로
        this.resetCellStyle(cell);
      }
    });

    // 선택된 셀 정보 초기화
    this.selectedCell = null;
  }

  public clearAllSelections(): void {
    this.gridCells.forEach((cell) => {
      this.resetCellStyle(cell);
    });
    this.selectedCell = null;
  }

  private resetCellStyle(cell: Container): void {
    const bg = (cell as any).background as Graphics;
    const dimensions = (cell as any).cellDimensions;

    if (bg && dimensions) {
      bg.clear();
      bg.roundRect(0, 0, dimensions.width, dimensions.height, 20);
      bg.fill(0xffffff);
      bg.stroke({ width: 1, color: 0xe9e9e9 });
    }
  }

  private applyCellSelectedStyle(cell: Container): void {
    const bg = (cell as any).background as Graphics;
    const dimensions = (cell as any).cellDimensions;

    if (bg && dimensions) {
      bg.clear();
      bg.roundRect(0, 0, dimensions.width, dimensions.height, 20);
      bg.fill(0xffffff);
      bg.stroke({ width: 3, color: 0x000000 });
    }
  }

  private applyCellWrongStyle(cell: Container): void {
    const bg = (cell as any).background as Graphics;
    const dimensions = (cell as any).cellDimensions;

    if (bg && dimensions) {
      bg.clear();
      bg.roundRect(0, 0, dimensions.width, dimensions.height, 20);
      bg.fill(0xffffff);
      bg.stroke({ width: 3, color: 0xf69f9f }); // 연분홍색
    }
  }

  private applyCellCorrectStyle(cell: Container): void {
    const bg = (cell as any).background as Graphics;
    const dimensions = (cell as any).cellDimensions;

    if (bg && dimensions) {
      bg.clear();
      bg.roundRect(0, 0, dimensions.width, dimensions.height, 20);
      bg.fill(0xffffff);
      bg.stroke({ width: 3, color: 0x000000 }); // 검은색
    }
  }

  private clearGrid(): void {
    this.gridCells.forEach((cell) => {
      this.removeChild(cell);
      cell.destroy();
    });
    this.gridCells = [];
    this.selectedCell = null;
  }

  public reset(): void {
    this.clearGrid();
    this.generateRandomizedStageWords();
    this.currentStage = 1;
    this.isInteractionEnabled = true;
    console.log("🔄 GameGrid 리셋 완료");
  }
}
