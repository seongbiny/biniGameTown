import { Container, Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import SceneController from "../../core/SceneController";
import { SceneType } from "../../types";

export class ReadyScene extends Scene {
  private titleText!: Text;
  private countdownBackground!: Graphics;
  private countdownText!: Text;
  private countdownContainer!: Container;
  private currentCount: number = 3;
  private countdownTimer?: NodeJS.Timeout;

  public initialize(): void {
    super.initialize();
    this.createTitleText();
    this.createCountdownElements();
    this.startCountdown();
  }

  private createTitleText(): void {
    this.titleText = new Text({
      text: "다르게 적힌 글자를\n찾아주세요",
      style: {
        fontFamily: "Pretendard",
        fontSize: 28,
        fill: 0x000000,
        align: "center",
        fontWeight: "600",
      },
    });

    this.titleText.anchor.set(0.5);
    this.titleText.x = this.screenWidth / 2;
    this.titleText.y = this.screenHeight / 2 - 100;

    this.addChild(this.titleText);
  }

  private createCountdownElements(): void {
    this.countdownContainer = new Container();

    // 검은색 원형 배경
    this.countdownBackground = new Graphics();
    this.countdownBackground.circle(0, 0, 50);
    this.countdownBackground.fill(0x000000);

    // 카운트다운 숫자 텍스트
    this.countdownText = new Text({
      text: this.currentCount.toString(),
      style: {
        fontSize: 48,
        fill: 0xffffff,
        align: "center",
        fontFamily: "Pretendard",
        fontWeight: "400",
      },
    });

    this.countdownText.anchor.set(0.5);

    this.countdownContainer.addChild(this.countdownBackground);
    this.countdownContainer.addChild(this.countdownText);

    // 중앙 하단에 위치
    this.countdownContainer.x = this.screenWidth / 2;
    this.countdownContainer.y = this.screenHeight / 2 + 50;

    this.addChild(this.countdownContainer);
  }

  private startCountdown(): void {
    this.updateCountdownDisplay();

    this.countdownTimer = setInterval(() => {
      this.currentCount--;

      if (this.currentCount >= 0) {
        this.updateCountdownDisplay();
      } else {
        this.finishCountdown();
      }
    }, 1000);
  }

  private updateCountdownDisplay(): void {
    this.countdownText.text = this.currentCount.toString();
  }

  private finishCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }

    // 카운트다운 완료 후 게임 시작 로직
    this.onCountdownComplete();
  }

  private onCountdownComplete(): void {
    // 게임 매니저에 게임 시작 알림
    console.log("카운트다운 완료! 게임 시작");

    // SceneController.getInstance().switchScene(SceneType.RESULT);
    SceneController.getInstance().switchScene(SceneType.PLAYING);
  }

  public reset(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
    this.currentCount = 3;
    super.reset();

    // reset 후 카운트다운 재시작
    this.startCountdown();
    console.log("🔄 ReadyScene reset complete");
  }

  public resume(): void {
    super.resume();
    console.log("▶️ ReadyScene resumed");
  }

  public pause(): void {
    super.pause();

    // 타이머 정리
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }

    console.log("⏸️ ReadyScene paused");
  }
}
