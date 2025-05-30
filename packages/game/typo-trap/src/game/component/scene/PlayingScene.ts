import { Container, Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { PlayingState } from "../../types";
import SceneController from "../../core/SceneController";
import { GameController } from "../../core/GameController";
import type { GameEventCallbacks } from "../../core/GameController";
import { getAnimationData } from "../../../assets/assetsPreload";
import lottie from "lottie-web";
import { ProgressBar } from "../ui/ProgressBar";
import type { ProgressBarConfig } from "../ui/ProgressBar";
import { GameGrid } from "../ui/GameGrid";
import type {
  GameGridConfig,
  GameGridCallbacks,
  Position,
} from "../ui/GameGrid";
export class PlayingScene extends Scene implements GameEventCallbacks {
  private progressBar!: ProgressBar;
  private gameGrid!: GameGrid;

  private stateUIContainer!: Container;
  private messageText!: Text;
  private actionButton!: Graphics;
  private buttonText!: Text;

  private successMessageText!: Text;

  private gameController: GameController;

  private animationContainer: HTMLDivElement | null = null;

  constructor(parent: Container) {
    super(parent);
    this.gameController = GameController.getInstance();
  }

  public initialize(): void {
    super.initialize();

    this.createProgressBar();
    this.createGameGrid();
    this.createSuccessMessage();
    this.createStateUI();

    // GameManager 초기화 및 콜백 설정
    this.gameController.initialize(this);

    const correctPositions = this.gameGrid.getCorrectPositions();
    this.gameController.setCorrectPositions(correctPositions);

    this.gameController.startNewGame();
  }

  private createGameGrid(): void {
    const config: GameGridConfig = {
      width: 400,
      height: 500,
      x: (this.screenWidth - 400) / 2,
      y: (this.screenHeight - 500) / 2,
    };

    const callbacks: GameGridCallbacks = {
      onCellClick: this.onGridCellClick.bind(this),
    };

    this.gameGrid = new GameGrid(config, callbacks);
    this.addChild(this.gameGrid);
  }

  public onGridCellClick(row: number, col: number): void {
    // 현재 게임 상태가 PLAYING이 아니면 클릭 무시
    if (this.gameController.getGameState() !== PlayingState.PLAYING) {
      console.log("🚫 게임이 진행 중이 아니므로 클릭 무시");
      return;
    }

    // 현재 단계와 정답 위치 확인
    const currentStage = this.gameController.getCurrentStage();
    const correctPositions = this.gameGrid.getCorrectPositions();
    const correctPos = correctPositions[currentStage - 1];

    // 정답인지 즉시 판단
    const isCorrect = row === correctPos.row && col === correctPos.col;

    if (isCorrect) {
      // 정답이면 즉시 lottie 애니메이션 재생
      console.log("🎉 정답! lottie 애니메이션 재생");
      this.playSuccessAnimation();
    }

    // GameController에게 클릭 이벤트 전달
    this.gameController.handleCellClick(row, col);
  }

  // GameEventCallbacks 인터페이스 구현
  public onStateChange(state: PlayingState, data?: any): void {
    console.log(`🎮 Game state changed to: ${state}`);

    switch (state) {
      case PlayingState.PLAYING:
        this.showGameUI();
        this.gameGrid.clearAllSelections();
        this.gameGrid.enableInteraction();
        break;

      case PlayingState.SUCCESS:
        this.gameGrid.disableInteraction(); // 성공 시 그리드 터치 비활성화
        this.handleSuccessState(data);
        break;

      case PlayingState.TIMEOUT:
        this.gameGrid.disableInteraction(); // 시간 초과 시 그리드 터치 비활성화
        this.handleTimeoutState(data);
        break;

      case PlayingState.WRONG:
        this.gameGrid.disableInteraction(); // 오답 시 그리드 터치 비활성화
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
      this.gameGrid.highlightWrongAndCorrectCells(
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
    this.gameGrid.createForStage(stage);
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

  public reset(): void {
    super.reset();

    if (this.animationContainer) {
      document.body.removeChild(this.animationContainer);
      this.animationContainer = null;
    }

    this.removeSuccessAnimation();

    // GameController 정리
    this.gameController.cleanup();

    // GameGrid 리셋
    this.gameGrid.reset();

    // GameGrid에서 새로 생성된 정답 위치를 GameController에 전달
    const correctPositions = this.gameGrid.getCorrectPositions();
    this.gameController.setCorrectPositions(correctPositions);

    // UI 상태 초기화
    this.progressBar.show();
    this.progressBar.reset();
    this.successMessageText.visible = false;
    this.stateUIContainer.visible = false;

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
