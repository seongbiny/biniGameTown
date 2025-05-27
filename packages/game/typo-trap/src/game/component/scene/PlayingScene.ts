import { Container, Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { GAME_CONFIG } from "../../types";

export class PlayingScene extends Scene {
  private progressBarContainer!: Container;
  private progressBarBg!: Graphics;
  private progressBarFill!: Graphics;

  private timer: number = 0;
  private timeLeft: number = GAME_CONFIG.TIME_LIMIT;
  private isTimerRunning: boolean = false;

  public initialize(): void {
    super.initialize();

    this.createProgressBar();
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
