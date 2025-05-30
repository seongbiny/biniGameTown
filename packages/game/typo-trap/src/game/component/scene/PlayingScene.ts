import { Container, Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { GAME_CONFIG, PlayingState } from "../../types";
import SceneController from "../../core/SceneController";
import { GameController } from "../../core/GameController";
import type { GameEventCallbacks } from "../../core/GameController";
import { getAnimationData } from "../../../assets/assetsPreload";
import lottie from "lottie-web";
import { ProgressBar } from "../ui/ProgressBar";
import type { ProgressBarConfig } from "../ui/ProgressBar";
export class PlayingScene extends Scene implements GameEventCallbacks {
  private progressBar!: ProgressBar;

  private gridContainer!: Container;
  private gridCells: Container[] = [];

  private stateUIContainer!: Container;
  private messageText!: Text;
  private actionButton!: Graphics;
  private buttonText!: Text;

  private successMessageText!: Text;

  private selectedCell: Container | null = null;
  private gameController: GameController;

  private animationContainer: HTMLDivElement | null = null;

  private readonly STAGE_GAPS = [10, 7, 5, 3, 3];

  private readonly STAGE_FONT_SIZES = [
    32, // 1단계: 2x2 - 큰 폰트
    28, // 2단계: 3x3 - 중간 폰트
    24, // 3단계: 4x4 - 기본 폰트
    20, // 4단계: 5x5 - 작은 폰트
    18, // 5단계: 5x5 - 더 작은 폰트
  ];

  private readonly STAGE_BASE_DATA = [
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

  private STAGE_WORDS: string[][][] = [];
  private CORRECT_POSITIONS: { row: number; col: number }[] = [];

  constructor(parent: Container) {
    super(parent);
    this.gameController = GameController.getInstance();
  }

  public initialize(): void {
    super.initialize();

    this.generateRandomizedStageWords();

    this.createProgressBar();
    this.createSuccessMessage();
    this.createStateUI();
    this.createGrid();

    // GameManager 초기화 및 콜백 설정
    this.gameController.initialize(this);
    this.gameController.startNewGame();
  }

  private generateRandomizedStageWords(): void {
    this.STAGE_WORDS = [];
    this.CORRECT_POSITIONS = [];

    this.STAGE_BASE_DATA.forEach((stageData, stageIndex) => {
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
      this.STAGE_WORDS.push(grid);
      this.CORRECT_POSITIONS.push({ row: randomRow, col: randomCol });

      console.log(
        "🔄 PlayingScene에서 GameController로 정답 위치 전달:",
        this.CORRECT_POSITIONS
      );
      this.gameController.setCorrectPositions(this.CORRECT_POSITIONS);
    });

    // GameController에 새로운 정답 위치 전달
    this.gameController.setCorrectPositions(this.CORRECT_POSITIONS);
  }

  // GameEventCallbacks 인터페이스 구현
  public onStateChange(state: PlayingState, data?: any): void {
    console.log(`🎮 Game state changed to: ${state}`);

    switch (state) {
      case PlayingState.PLAYING:
        this.showGameUI();
        this.clearAllCellSelections();
        this.enableGridInteraction(); // 플레이 중일 때만 그리드 터치 가능
        break;

      case PlayingState.SUCCESS:
        this.disableGridInteraction(); // 성공 시 그리드 터치 비활성화
        this.handleSuccessState(data);
        break;

      case PlayingState.TIMEOUT:
        this.disableGridInteraction(); // 시간 초과 시 그리드 터치 비활성화
        this.handleTimeoutState(data);
        break;

      case PlayingState.WRONG:
        this.disableGridInteraction(); // 오답 시 그리드 터치 비활성화
        this.handleWrongState(data);
        break;
    }
  }

  private handleTimeoutState(data: any): void {
    if (!data) return;

    // 프로그레스바 숨기고 상단에 시간 초과 메시지 표시
    this.progressBar.hide();
    this.successMessageText.text = data.topMessage;
    this.successMessageText.style.fill = 0x000000;
    this.successMessageText.style.fontSize = 24;

    const gridTopY = (this.screenHeight - 500) / 2;
    const messageY = gridTopY / 2;
    this.successMessageText.y = messageY;

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

      case "final_complete":
        setTimeout(() => {
          SceneController.getInstance().switchScene("RESULT");
        }, 3000);
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

  private removeSuccessAnimation(): void {
    if (this.animationContainer) {
      console.log("🗑️ lottie 애니메이션 강제 제거");
      document.body.removeChild(this.animationContainer);
      this.animationContainer = null;
    }
  }

  private enableGridInteraction(): void {
    this.gridCells.forEach((cell) => {
      cell.eventMode = "static";
      cell.cursor = "pointer";
    });
    console.log("✅ 그리드 터치 활성화");
  }

  private disableGridInteraction(): void {
    this.gridCells.forEach((cell) => {
      cell.eventMode = "none";
      cell.cursor = "default";
    });
    console.log("❌ 그리드 터치 비활성화");
  }

  private playSuccessAnimation(): void {
    const animationData = getAnimationData();
    if (!animationData) {
      console.warn("🚨 success.json lottie 데이터를 찾을 수 없습니다.");
      return;
    }

    // 기존 애니메이션 컨테이너가 있으면 제거
    this.removeSuccessAnimation();

    // 애니메이션 컨테이너 생성
    this.animationContainer = document.createElement("div");

    // stage의 scale 값 가져오기
    const stageScale = this.parent.scale.x;

    // 기본 게임 크기 (450 * 800)에 스케일 적용
    const baseWidth = 450;
    const baseHeight = 800;
    const scaledWidth = baseWidth * stageScale;
    const scaledHeight = baseHeight * stageScale;

    // 게임 캔버스의 위치 정보 가져오기
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("캔버스 요소를 찾을 수 없습니다.");
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const centerX = canvasRect.left + canvasRect.width / 2;
    const centerY = canvasRect.top + canvasRect.height / 2;

    // 애니메이션 컨테이너 스타일 설정
    this.animationContainer.style.position = "fixed";
    this.animationContainer.style.left = `${centerX}px`;
    this.animationContainer.style.top = `${centerY}px`;
    this.animationContainer.style.transform = "translate(-50%, -50%)";
    this.animationContainer.style.width = `${scaledWidth}px`;
    this.animationContainer.style.height = `${scaledHeight}px`;
    this.animationContainer.style.zIndex = "1000";
    this.animationContainer.style.pointerEvents = "none";
    this.animationContainer.style.display = "flex";
    this.animationContainer.style.alignItems = "center";
    this.animationContainer.style.justifyContent = "center";
    document.body.appendChild(this.animationContainer);

    console.log("🎊 lottie 애니메이션 시작!", {
      baseSize: `${baseWidth}x${baseHeight}`,
      scale: stageScale,
      scaledSize: `${scaledWidth}x${scaledHeight}`,
      canvasSize: `${canvasRect.width}x${canvasRect.height}`,
    });

    const animation = lottie.loadAnimation({
      container: this.animationContainer,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    // 애니메이션 완료 후 컨테이너 제거
    animation.addEventListener("complete", () => {
      console.log("✅ lottie 애니메이션 완료!");
      this.removeSuccessAnimation();
    });

    // 창 크기 조정 시 애니메이션 크기 및 위치 업데이트
    const updateSizeAndPosition = () => {
      if (this.animationContainer && canvas) {
        const newStageScale = this.parent.scale.x;
        const newScaledWidth = baseWidth * newStageScale;
        const newScaledHeight = baseHeight * newStageScale;

        const newCanvasRect = canvas.getBoundingClientRect();
        const newCenterX = newCanvasRect.left + newCanvasRect.width / 2;
        const newCenterY = newCanvasRect.top + newCanvasRect.height / 2;

        this.animationContainer.style.left = `${newCenterX}px`;
        this.animationContainer.style.top = `${newCenterY}px`;
        this.animationContainer.style.width = `${newScaledWidth}px`;
        this.animationContainer.style.height = `${newScaledHeight}px`;

        console.log("🔄 lottie 크기 업데이트:", {
          scale: newStageScale,
          size: `${newScaledWidth}x${newScaledHeight}`,
        });
      }
    };

    window.addEventListener("resize", updateSizeAndPosition);
    animation.addEventListener("complete", () => {
      window.removeEventListener("resize", updateSizeAndPosition);
    });
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
    this.progressBar.hide();
    this.successMessageText.text = data.topMessage;
    this.successMessageText.style.fill = 0x000000;
    this.successMessageText.style.fontSize = 24;

    const gridTopY = (this.screenHeight - 500) / 2;
    const messageY = gridTopY / 2;
    this.successMessageText.y = messageY;

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
    this.progressBar.visible = true;
    this.successMessageText.visible = false;
    this.stateUIContainer.visible = false;
  }

  private showSuccessMessage(message: string): void {
    this.progressBar.visible = false;
    this.successMessageText.text = message;
    this.successMessageText.style.fill = 0x000000;
    this.successMessageText.style.fontSize = 24;

    // 그리드와 화면 상단 사이의 가운데 위치
    const gridTopY = (this.screenHeight - 500) / 2;
    const messageY = gridTopY / 2;
    this.successMessageText.y = messageY;

    this.successMessageText.visible = true;
    this.stateUIContainer.visible = false;
  }

  private showNextStageUI(
    topMessage: string,
    buttonText: string,
    buttonColor: number
  ): void {
    this.progressBar.hide();

    // 상단 메시지 설정
    this.successMessageText.text = topMessage;
    this.successMessageText.style.fill = 0x000000;
    this.successMessageText.style.fontSize = 24;

    // 그리드와 화면 상단 사이의 가운데 위치
    const gridTopY = (this.screenHeight - 500) / 2;
    const messageY = gridTopY / 2;
    this.successMessageText.y = messageY;

    this.successMessageText.visible = true;

    // 하단에 버튼만 표시 (메시지는 비우기)
    this.showStateUI("", buttonText, buttonColor);
  }

  public onTimerUpdate(timeLeft: number, progress: number): void {
    this.progressBar.updateProgress(progress);
  }

  public onStageChange(stage: number): void {
    console.log(`🎯 Stage changed to: ${stage}`);
    this.createGridForStage(stage);
  }

  private createSuccessMessage(): void {
    this.successMessageText = new Text({
      text: "",
      style: {
        fontFamily: "Pretendard",
        fontSize: 24,
        fill: 0x000000,
        align: "center",
        fontWeight: "600",
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
        fontFamily: "Pretendard",
        fontSize: 24,
        fill: 0x000000,
        align: "center",
        fontWeight: "600",
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
        fontFamily: "Pretendard",
        fontSize: 20,
        fill: 0xffffff,
        align: "center",
        fontWeight: "600",
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
        this.removeSuccessAnimation();

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
    const width = Math.min(410, this.screenWidth * 0.9);

    const config: ProgressBarConfig = {
      width: width,
      height: 10,
      x: (this.screenWidth - width) / 2,
      y: 34,
      backgroundColor: 0xd9d9d9,
      fillColor: 0x000000,
      borderRadius: 5, // 모서리 둥글게
    };

    this.progressBar = new ProgressBar(config);
    this.addChild(this.progressBar);
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
          word,
          stage
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
    // 현재 게임 상태가 PLAYING이 아니면 클릭 무시
    if (this.gameController.getGameState() !== PlayingState.PLAYING) {
      console.log("🚫 게임이 진행 중이 아니므로 클릭 무시");
      return;
    }

    console.log(`🎯 Cell clicked: (${row}, ${col})`);

    this.updateCellSelection(cellContainer);

    // 현재 단계 가져오기
    const currentStage = this.gameController.getCurrentStage();
    const correctPos = this.CORRECT_POSITIONS[currentStage - 1];

    // 정답인지 즉시 판단
    const isCorrect = row === correctPos.row && col === correctPos.col;

    if (isCorrect) {
      // 정답이면 즉시 lottie 애니메이션 재생
      console.log("🎉 정답! lottie 애니메이션 재생");
      this.playSuccessAnimation();
    }

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
    this.actionButton.roundRect(-205, -25, 410, 50, 10);
    this.actionButton.fill(0x353739);
    this.actionButton.stroke({ width: 2, color: 0x353739 });

    this.buttonText.text = buttonText;
    this.buttonText.style.fill = 0xffffff;
    this.buttonText.style.fontSize = 20;

    this.stateUIContainer.visible = true;
  }

  private clearGrid(): void {
    this.gridCells.forEach((cell) => {
      this.gridContainer.removeChild(cell);
      cell.destroy();
    });
    this.gridCells = [];
  }

  public reset(): void {
    super.reset();

    if (this.animationContainer) {
      document.body.removeChild(this.animationContainer);
      this.animationContainer = null;
    }

    this.removeSuccessAnimation();

    // GameController 정리
    this.gameController.cleanup();

    this.generateRandomizedStageWords();

    // UI 상태 초기화
    this.progressBar.show();
    this.progressBar.reset();
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

    if (this.animationContainer) {
      document.body.removeChild(this.animationContainer);
      this.animationContainer = null;
    }

    this.removeSuccessAnimation();

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
