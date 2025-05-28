import { GAME_CONFIG, PlayingState } from "../types";

export interface GameEventCallbacks {
  onStateChange: (state: PlayingState, data?: any) => void;
  onTimerUpdate: (timeLeft: number, progress: number) => void;
  onStageChange: (stage: number) => void;
}

export class GameController {
  private static instance: GameController;

  private currentStage: number = 1;
  private gameState: PlayingState = PlayingState.PLAYING;
  private timeLeft: number = GAME_CONFIG.TIME_LIMIT;
  private isTimerRunning: boolean = false;
  private timer: number = 0;

  private callbacks: GameEventCallbacks | null = null;

  private readonly CORRECT_POSITIONS = [
    { row: 0, col: 1 }, // 1단계: "재쵹"
    { row: 2, col: 2 }, // 2단계: "휸민정음"
    { row: 0, col: 2 }, // 3단계: "데한민국"
    { row: 4, col: 3 }, // 4단계: "댸한\n민국\n만세"
  ];

  public static getInstance(): GameController {
    if (!GameController.instance) {
      GameController.instance = new GameController();
    }
    return GameController.instance;
  }

  public initialize(callbacks: GameEventCallbacks): void {
    this.callbacks = callbacks;
    this.currentStage = 1;
    this.gameState = PlayingState.PLAYING;
  }

  public startNewGame(): void {
    this.currentStage = 1;
    this.startStage();
  }

  public startStage(): void {
    this.gameState = PlayingState.PLAYING;
    this.timeLeft = GAME_CONFIG.TIME_LIMIT;

    this.callbacks?.onStateChange(this.gameState);
    this.callbacks?.onStageChange(this.currentStage);

    this.startTimer();
  }

  public handleCellClick(row: number, col: number): boolean {
    if (this.gameState !== PlayingState.PLAYING) return false;

    this.stopTimer();

    const correctPos = this.CORRECT_POSITIONS[this.currentStage - 1];
    const isCorrect = row === correctPos.row && col === correctPos.col;

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }

    return isCorrect;
  }

  private handleCorrectAnswer(): void {
    this.gameState = PlayingState.SUCCESS;

    const resultData = {
      stage: "success_message",
      message: `${this.currentStage}단계 성공!`,
      currentStage: this.currentStage,
      isLastStage: this.currentStage >= GAME_CONFIG.STAGE_COUNT,
    };

    this.callbacks?.onStateChange(this.gameState, resultData);

    setTimeout(() => {
      this.showNextStageConfirm();
    }, 1000);
  }

  private showNextStageConfirm(): void {
    if (this.currentStage < GAME_CONFIG.STAGE_COUNT) {
      const nextStage = this.currentStage + 1;
      const resultData = {
        stage: "next_stage_confirm",
        topMessage: `${nextStage}단계도 바로\n도전해 볼까요?`, // 상단 메시지
        buttonText: `${nextStage}단계 도전하기`,
        buttonColor: 0x4caf50,
        currentStage: this.currentStage,
        nextStage: nextStage,
      };

      this.callbacks?.onStateChange(this.gameState, resultData);
    } else {
      // 마지막 단계인 경우
      const resultData = {
        stage: "all_complete",
        topMessage: "모든 단계 완료! 🎉\n축하합니다!",
        buttonText: "결과 보기",
        buttonColor: 0x4caf50,
        currentStage: this.currentStage,
      };

      this.callbacks?.onStateChange(this.gameState, resultData);
    }
  }

  private handleWrongAnswer(): void {
    this.gameState = PlayingState.WRONG;
    console.log("❌ Wrong answer!");

    const resultData = {
      stage: "wrong",
      message: "틀렸습니다! 😢\n다시 도전하세요",
      buttonText: "다시하기",
      buttonColor: 0xff5722,
      canProceed: false,
    };

    this.callbacks?.onStateChange(this.gameState, resultData);
  }

  private handleTimeOut(): void {
    this.gameState = PlayingState.TIMEOUT;
    console.log("⏰ Time out!");

    const resultData = {
      stage: "timeout",
      message: "시간 초과! ⏰\n다시 도전하세요",
      buttonText: "다시하기",
      buttonColor: 0xff9800,
      canProceed: false,
    };

    this.callbacks?.onStateChange(this.gameState, resultData);
  }

  public proceedToNextStage(): boolean {
    if (this.gameState !== PlayingState.SUCCESS) {
      return false;
    }

    if (this.currentStage < GAME_CONFIG.STAGE_COUNT) {
      this.currentStage++;
      this.startStage();
      return true;
    } else {
      // 모든 단계 완료
      console.log("🎉 All stages completed!");
      return false; // ResultScene으로 전환 신호
    }
  }

  private startTimer(): void {
    this.stopTimer();
    this.isTimerRunning = true;

    this.timer = window.setInterval(() => {
      this.timeLeft -= 100;

      const progress = Math.max(0, this.timeLeft / GAME_CONFIG.TIME_LIMIT);
      this.callbacks?.onTimerUpdate(this.timeLeft, progress);

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.handleTimeOut();
      }
    }, 100);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
    this.isTimerRunning = false;
  }

  public cleanup(): void {
    this.stopTimer();
    this.callbacks = null;
  }

  public getCurrentStage(): number {
    return this.currentStage;
  }

  public getGameState(): PlayingState {
    return this.gameState;
  }

  public getTimeLeft(): number {
    return this.timeLeft;
  }

  public isGameActive(): boolean {
    return this.gameState === PlayingState.PLAYING;
  }
}
