import { Container } from "pixi.js";
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
import { StateMessage } from "../ui/StateMessage";
import type { StateMessageConfig } from "../ui/StateMessage";
import { ActionButton, ButtonStyle } from "../ui/ActionButton";
import type { ActionButtonCallbacks } from "../ui/ActionButton";
export class PlayingScene
  extends Scene
  implements GameEventCallbacks, ActionButtonCallbacks
{
  private progressBar!: ProgressBar;
  private gameGrid!: GameGrid;
  private stateMessage!: StateMessage;
  private actionButton!: ActionButton;

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
    this.createStateMessage();
    this.createActionButton();

    // GameManager 초기화 및 콜백 설정
    this.gameController.initialize(this);

    const correctPositions = this.gameGrid.getCorrectPositions();
    this.gameController.setCorrectPositions(correctPositions);

    this.gameController.startNewGame();
  }

  private createActionButton(): void {
    this.actionButton = new ActionButton(
      {
        text: "", // 초기에는 빈 텍스트
        x: this.screenWidth / 2,
        y: this.screenHeight - 60,
      },
      {
        onClick: this.onClick.bind(this), // 콜백 연결
      }
    );
    this.actionButton.hide(); // 초기에는 숨김
    this.addChild(this.actionButton);
  }

  public onClick(action: string, button: ActionButton): void {
    console.log(`🔘 PlayingScene ActionButton clicked: ${action}`);

    switch (action) {
      case "next_stage":
        this.removeSuccessAnimation();
        const hasNextStage = this.gameController.proceedToNextStage();
        if (!hasNextStage) {
          SceneController.getInstance().switchScene("RESULT");
        }
        break;

      case "retry":
        SceneController.getInstance().switchScene("READY");
        break;

      default:
        console.warn(`⚠️ Unknown action: ${action}`);
        break;
    }
  }

  public onStateChange(state: PlayingState, data?: any): void {
    console.log(`🎮 Game state changed to: ${state}`);

    switch (state) {
      case PlayingState.PLAYING:
        this.showGameUI();
        this.gameGrid.clearAllSelections();
        this.gameGrid.enableInteraction();
        break;

      case PlayingState.SUCCESS:
        this.gameGrid.disableInteraction();
        this.handleSuccessState(data);
        break;

      case PlayingState.TIMEOUT:
        this.gameGrid.disableInteraction();
        this.handleTimeoutState(data);
        break;

      case PlayingState.WRONG:
        this.gameGrid.disableInteraction();
        this.handleWrongState(data);
        break;
    }
  }

  private createStateMessage(): void {
    const config: StateMessageConfig = {
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight,
      gridTopY: (this.screenHeight - 500) / 2,
    };

    this.stateMessage = new StateMessage(config);
    this.addChild(this.stateMessage);
  }

  public onStateMessageButtonClick(action: string): void {
    console.log(`🔘 StateMessage action received: ${action}`);

    switch (action) {
      case "next_stage":
        this.removeSuccessAnimation();
        const hasNextStage = this.gameController.proceedToNextStage();
        if (!hasNextStage) {
          SceneController.getInstance().switchScene("RESULT");
        }
        break;

      case "retry":
        SceneController.getInstance().switchScene("READY");
        break;

      default:
        console.warn(`⚠️ Unknown StateMessage action: ${action}`);
        break;
    }
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

  private handleTimeoutState(data: any): void {
    if (!data) return;

    this.progressBar.hide();
    this.stateMessage.showTopMessage(data.topMessage);
    this.actionButton.setText(data.buttonText);
    this.actionButton.setAction("retry");
    this.actionButton.setStyle(ButtonStyle.WARNING);
    this.actionButton.show();
  }

  private handleSuccessState(data: any): void {
    if (!data) return;

    switch (data.stage) {
      case "success_message":
        // 메시지만 표시, 버튼 숨김
        this.progressBar.hide();
        this.stateMessage.showTopMessage(data.message);
        this.actionButton.hide();
        break;

      case "next_stage_confirm":
        // 메시지 + 버튼 표시
        this.progressBar.hide();
        this.stateMessage.showTopMessage(data.topMessage);
        this.actionButton.setText(data.buttonText);
        this.actionButton.setAction("next_stage");
        this.actionButton.setStyle(ButtonStyle.PRIMARY);
        this.actionButton.show();
        break;

      case "final_complete":
        setTimeout(() => {
          SceneController.getInstance().switchScene("RESULT");
        }, 3000);
        break;

      case "all_complete":
        this.progressBar.hide();
        this.stateMessage.showTopMessage(data.topMessage);
        this.actionButton.setText(data.buttonText);
        this.actionButton.setAction("next_stage");
        this.actionButton.setStyle(ButtonStyle.PRIMARY);
        this.actionButton.show();
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

    if (data.selectedPosition && data.correctPosition) {
      this.gameGrid.highlightWrongAndCorrectCells(
        data.selectedPosition,
        data.correctPosition
      );
    }

    this.progressBar.hide();
    this.stateMessage.showTopMessage(data.topMessage);
    this.actionButton.setText(data.buttonText);
    this.actionButton.setAction("retry");
    this.actionButton.setStyle(ButtonStyle.SECONDARY);
    this.actionButton.show();
  }

  private showGameUI(): void {
    this.progressBar.visible = true;
    this.stateMessage.hide();
    this.actionButton.hide(); // 게임 중에는 버튼 숨김
  }

  public onTimerUpdate(timeLeft: number, progress: number): void {
    this.progressBar.updateProgress(progress);
  }

  public onStageChange(stage: number): void {
    console.log(`🎯 Stage changed to: ${stage}`);
    this.gameGrid.createForStage(stage);
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

  public reset(): void {
    super.reset();

    if (this.animationContainer) {
      document.body.removeChild(this.animationContainer);
      this.animationContainer = null;
    }

    this.actionButton.reset();

    this.removeSuccessAnimation();

    // GameController 정리
    this.gameController.cleanup();

    // GameGrid 리셋
    this.gameGrid.reset();

    // StateMessage 리셋
    this.stateMessage.reset();

    // GameGrid에서 새로 생성된 정답 위치를 GameController에 전달
    const correctPositions = this.gameGrid.getCorrectPositions();
    this.gameController.setCorrectPositions(correctPositions);

    // UI 상태 초기화
    this.progressBar.show();
    this.progressBar.reset();

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
