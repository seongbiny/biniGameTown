import { Container, Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { GAME_CONFIG, PlayingState } from "../../types";
import SceneController from "../../core/SceneController";
import { GameController } from "../../core/GameController";
import type { GameEventCallbacks } from "../../core/GameController";

export class PlayingScene extends Scene implements GameEventCallbacks {
  private progressBarContainer!: Container;
  private progressBarBg!: Graphics;
  private progressBarFill!: Graphics;

  private gridContainer!: Container;
  private gridCells: Container[] = [];

  private stateUIContainer!: Container;
  private messageText!: Text;
  private actionButton!: Graphics;
  private buttonText!: Text;

  private successMessageText!: Text;

  private selectedCell: Container | null = null;
  private gameController: GameController;

  private readonly STAGE_GAPS = [10, 7, 5, 3];

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

  constructor(parent: Container) {
    super(parent);
    this.gameController = GameController.getInstance();
  }

  public initialize(): void {
    super.initialize();

    this.createProgressBar();
    this.createSuccessMessage();
    this.createStateUI();
    this.createGrid();

    // GameManager 초기화 및 콜백 설정
    this.gameController.initialize(this);
    this.gameController.startNewGame();
  }

  // GameEventCallbacks 인터페이스 구현
  public onStateChange(state: PlayingState, data?: any): void {
    console.log(`🎮 Game state changed to: ${state}`);

    switch (state) {
      case PlayingState.PLAYING:
        this.showGameUI();
        this.clearAllCellSelections();
        break;

      case PlayingState.SUCCESS:
        this.handleSuccessState(data);
        break;

      case PlayingState.TIMEOUT:
        this.handleTimeoutState(data);
        break;

      case PlayingState.WRONG:
        this.handleWrongState(data);
        break;
    }
  }

  private handleTimeoutState(data: any): void {
    if (!data) return;

    // 프로그레스바 숨기고 상단에 시간 초과 메시지 표시
    this.progressBarContainer.visible = false;
    this.successMessageText.text = data.topMessage;
    this.successMessageText.style.fill = 0xff9800; // 주황색으로 변경
    this.successMessageText.visible = true;

    // 하단에 버튼만 표시
    this.showStateUI("", data.buttonText, data.buttonColor);
  }

  private handleSuccessState(data: any): void {
    if (!data) return;

    switch (data.stage) {
      case "success_message":
        // 1단계: "N단계 성공!" 메시지만 상단에 표시
        this.showSuccessMessage(data.message);
        break;

      case "next_stage_confirm":
        // 2단계: 상단 메시지 변경 + 하단 버튼 표시
        this.showNextStageUI(
          data.topMessage,
          data.buttonText,
          data.buttonColor
        );
        break;

      case "all_complete":
        // 모든 단계 완료
        this.showNextStageUI(
          data.topMessage,
          data.buttonText,
          data.buttonColor
        );
        break;
    }
  }

  private handleWrongState(data: any): void {
    if (!data) return;

    // 선택한 셀을 빨간색으로, 정답 셀을 검은색으로 표시
    if (data.selectedPosition && data.correctPosition) {
      this.highlightWrongAndCorrectCells(
        data.selectedPosition,
        data.correctPosition
      );
    }

    // 프로그레스바 숨기고 상단에 오답 메시지 표시
    this.progressBarContainer.visible = false;
    this.successMessageText.text = data.topMessage;
    this.successMessageText.style.fill = 0xf69f9f; // 연분홍색으로 변경
    this.successMessageText.visible = true;

    // 하단에 버튼만 표시
    this.showStateUI("", data.buttonText, data.buttonColor);
  }

  private highlightWrongAndCorrectCells(
    selectedPos: { row: number; col: number },
    correctPos: { row: number; col: number }
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

  private showGameUI(): void {
    this.progressBarContainer.visible = true;
    this.successMessageText.visible = false;
    this.stateUIContainer.visible = false;
  }

  private showSuccessMessage(message: string): void {
    this.progressBarContainer.visible = false;
    this.successMessageText.text = message;
    this.successMessageText.visible = true;
    this.stateUIContainer.visible = false;
  }

  private showNextStageUI(
    topMessage: string,
    buttonText: string,
    buttonColor: number
  ): void {
    // 상단 메시지 변경
    this.successMessageText.text = topMessage;
    this.successMessageText.visible = true;

    // 하단에 버튼만 표시 (메시지는 비우기)
    this.showStateUI("", buttonText, buttonColor);
  }

  private showNextStageConfirm(
    message: string,
    buttonText: string,
    buttonColor: number
  ): void {
    // 성공 메시지는 그대로 두고, 하단에 확인 UI 표시
    this.showStateUI(message, buttonText, buttonColor);
  }

  public onTimerUpdate(timeLeft: number, progress: number): void {
    this.updateProgressBar(progress);
  }

  public onStageChange(stage: number): void {
    console.log(`🎯 Stage changed to: ${stage}`);
    this.createGridForStage(stage);
  }

  private createSuccessMessage(): void {
    this.successMessageText = new Text({
      text: "",
      style: {
        fontSize: 24,
        fill: 0x4caf50, // 초록색
        align: "center",
        fontWeight: "bold",
      },
    });
    this.successMessageText.anchor.set(0.5);
    this.successMessageText.x = this.screenWidth / 2;
    this.successMessageText.y = 34 + 5; // 프로그레스바와 같은 위치
    this.successMessageText.visible = false;
    this.addChild(this.successMessageText);
  }

  private createStateUI(): void {
    this.stateUIContainer = new Container();
    this.addChild(this.stateUIContainer);

    this.messageText = new Text({
      text: "",
      style: {
        fontSize: 24,
        fill: 0x000000,
        align: "center",
      },
    });
    this.messageText.anchor.set(0.5);
    this.messageText.x = this.screenWidth / 2;
    this.messageText.y = this.screenHeight - 120;
    this.stateUIContainer.addChild(this.messageText);

    this.actionButton = new Graphics();
    this.actionButton.x = this.screenWidth / 2;
    this.actionButton.y = this.screenHeight - 60;
    this.actionButton.eventMode = "static";
    this.actionButton.cursor = "pointer";
    this.actionButton.on("pointerdown", this.onButtonClick.bind(this));
    this.stateUIContainer.addChild(this.actionButton);

    this.buttonText = new Text({
      text: "",
      style: {
        fontSize: 20,
        fill: 0xffffff,
        align: "center",
      },
    });

    this.buttonText.anchor.set(0.5);
    this.actionButton.addChild(this.buttonText);

    this.stateUIContainer.visible = false;
  }

  private onButtonClick(): void {
    const currentState = this.gameController.getGameState();
    console.log(`🔘 Button clicked in state: ${currentState}`);

    switch (currentState) {
      case PlayingState.SUCCESS:
        const hasNextStage = this.gameController.proceedToNextStage();
        if (!hasNextStage) {
          SceneController.getInstance().switchScene("RESULT");
        }
        break;

      case PlayingState.WRONG:
      case PlayingState.TIMEOUT:
        SceneController.getInstance().switchScene("READY");
        break;
    }
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

    this.updateProgressBar(1.0);
  }

  private createGrid(): void {
    this.gridContainer = new Container();
    this.addChild(this.gridContainer);

    this.gridContainer.x = (this.screenWidth - 400) / 2;
    this.gridContainer.y = (this.screenHeight - 500) / 2;
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
    console.log(`🎯 Cell clicked: (${row}, ${col})`);

    this.updateCellSelection(cellContainer);

    // GameManager에게 클릭 이벤트 전달
    this.gameController.handleCellClick(row, col);
  }

  private updateCellSelection(newSelectedCell: Container): void {
    if (this.selectedCell) {
      this.resetCellStyle(this.selectedCell);
    }

    this.applyCellSelectedStyle(newSelectedCell);
    this.selectedCell = newSelectedCell;
  }

  private resetCellStyle(cell: Container): void {
    const bg = (cell as any).background as Graphics;
    const dimensions = (cell as any).cellDimensions;

    if (bg && dimensions) {
      bg.clear();
      bg.roundRect(0, 0, dimensions.width, dimensions.height, 20);
      bg.fill(0xffffff);
      bg.stroke({ width: 2, color: 0xe9e9e9 });
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

  private clearAllCellSelections(): void {
    this.gridCells.forEach((cell) => {
      this.resetCellStyle(cell);
    });
    this.selectedCell = null;
  }

  private showStateUI(
    message: string,
    buttonText: string,
    buttonColor: number
  ): void {
    // 메시지가 비어있으면 텍스트 숨기기
    if (message.trim() === "") {
      this.messageText.visible = false;
    } else {
      this.messageText.text = message;
      this.messageText.visible = true;
    }

    this.actionButton.clear();
    this.actionButton.roundRect(-80, -20, 160, 40, 20);
    this.actionButton.fill(buttonColor);
    this.actionButton.stroke({ width: 2, color: buttonColor });

    this.buttonText.text = buttonText;
    this.stateUIContainer.visible = true;
  }

  private clearGrid(): void {
    this.gridCells.forEach((cell) => {
      this.gridContainer.removeChild(cell);
      cell.destroy();
    });
    this.gridCells = [];
  }

  private updateProgressBar(progress: number = 1.0): void {
    this.progressBarFill.clear();

    const fillWidth = 345 * Math.max(0, Math.min(1, progress)); // progress를 0-1로 제한

    if (fillWidth > 0) {
      this.progressBarFill.rect(0, 0, fillWidth, 10);
      this.progressBarFill.fill(0x000000);
    }
  }

  public reset(): void {
    super.reset();

    // GameController 정리
    this.gameController.cleanup();

    // UI 상태 초기화
    this.progressBarContainer.visible = true;
    this.successMessageText.visible = false;
    this.stateUIContainer.visible = false;

    // 그리드 정리
    this.clearGrid();
    this.clearAllCellSelections();

    // GameController 재초기화 및 새 게임 시작
    this.gameController.initialize(this);
    this.gameController.startNewGame();

    console.log("🔄 PlayingScene reset complete");
  }

  public pause(): void {
    super.pause();

    // GameController 정리 (타이머 정지 등)
    this.gameController.cleanup();

    console.log("⏸️ PlayingScene paused");
  }

  public resume(): void {
    super.resume();
    console.log("▶️ PlayingScene resumed");
  }

  public update(_deltaTime: number): void {
    super.update(_deltaTime);
  }
}
