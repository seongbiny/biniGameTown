import { Container } from "pixi.js";
import { GAME_CONFIG } from "../../types";
import { GridCell, CellState } from "./GridCell";
import type { GridCellConfig, GridCellCallbacks } from "./GridCell";

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

export class GameGrid extends Container implements GridCellCallbacks {
  private gridCells: GridCell[] = [];
  private selectedCell: GridCell | null = null;
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
    const fontSize = this.STAGE_FONT_SIZES[stage - 1];

    const cellWidth = (this.config.width - gap * (gridSize - 1)) / gridSize;
    const cellHeight = (this.config.height - gap * (gridSize - 1)) / gridSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * (cellWidth + gap);
        const y = row * (cellHeight + gap);
        const word = this.stageWords[stage - 1][row][col];

        const cellConfig: GridCellConfig = {
          x,
          y,
          width: cellWidth,
          height: cellHeight,
          word,
          fontSize,
          row,
          col,
        };

        const cellCallbacks: GridCellCallbacks = {
          onCellClick: this.onCellClick.bind(this),
        };

        const cell = new GridCell(cellConfig, cellCallbacks);
        this.addChild(cell);
        this.gridCells.push(cell);
      }
    }

    console.log(
      `🎮 GameGrid created ${this.gridCells.length} cells for stage ${stage}`
    );
  }

  // GridCellCallbacks 인터페이스 구현
  public onCellClick(row: number, col: number, cell: GridCell): void {
    if (!this.isInteractionEnabled) {
      console.log("🚫 그리드 상호작용이 비활성화됨");
      return;
    }

    console.log(`🎯 GameGrid received cell click: (${row}, ${col})`);

    this.updateCellSelection(cell);
    this.callbacks.onCellClick(row, col);
  }

  private updateCellSelection(newSelectedCell: GridCell): void {
    // 이전 선택된 셀을 기본 상태로 되돌리기
    if (this.selectedCell && this.selectedCell !== newSelectedCell) {
      this.selectedCell.setState(CellState.DEFAULT);
    }

    // 새로운 셀을 선택 상태로 설정
    newSelectedCell.setState(CellState.SELECTED);
    this.selectedCell = newSelectedCell;
  }

  public enableInteraction(): void {
    this.isInteractionEnabled = true;
    this.gridCells.forEach((cell) => {
      cell.enableInteraction();
    });
    console.log("✅ GameGrid 상호작용 활성화");
  }

  public disableInteraction(): void {
    this.isInteractionEnabled = false;
    this.gridCells.forEach((cell) => {
      cell.disableInteraction();
    });
    console.log("❌ GameGrid 상호작용 비활성화");
  }

  public highlightWrongAndCorrectCells(
    selectedPos: Position,
    correctPos: Position
  ): void {
    this.gridCells.forEach((cell) => {
      const cellPos = cell.getPosition();

      if (cellPos.row === selectedPos.row && cellPos.col === selectedPos.col) {
        // 선택한 셀 (틀린 답) - 연분홍색
        cell.setState(CellState.WRONG);
      } else if (
        cellPos.row === correctPos.row &&
        cellPos.col === correctPos.col
      ) {
        // 정답 셀 - 검은색
        cell.setState(CellState.CORRECT);
      } else {
        // 나머지 셀들은 기본 스타일로
        cell.setState(CellState.DEFAULT);
      }
    });

    // 선택된 셀 정보 초기화
    this.selectedCell = null;
  }

  public clearAllSelections(): void {
    this.gridCells.forEach((cell) => {
      cell.setState(CellState.DEFAULT);
    });
    this.selectedCell = null;
  }

  public findCellAt(row: number, col: number): GridCell | null {
    return (
      this.gridCells.find((cell) => {
        const pos = cell.getPosition();
        return pos.row === row && pos.col === col;
      }) || null
    );
  }

  public getSelectedCell(): GridCell | null {
    return this.selectedCell;
  }

  public getAllCells(): GridCell[] {
    return [...this.gridCells]; // 복사본 반환
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

  // 디버깅 메서드
  public getDebugInfo(): string {
    const cellInfo = this.gridCells
      .map((cell) => cell.getDebugInfo())
      .join("\n");
    return `GameGrid Stage ${this.currentStage}:\n${cellInfo}`;
  }
}
