import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Scene } from "./Scene";

export class ResultScene extends Scene {
  private kingImage!: Sprite;
  private congratulationText!: Text;
  private recordText!: Text;
  private shareButton!: Graphics;
  private shareButtonText!: Text;

  private totalTime: number = 0;

  constructor(parent: Container) {
    super(parent);
  }

  public initialize(): void {
    super.initialize();

    this.createKingImage();
    this.createCongratulationText();
    this.createRecordText();
    this.createShareButton();
  }

  public setResult(totalTime: number): void {
    this.totalTime = totalTime;
    this.updateRecordText();
  }

  public createKingImage(): void {
    this.kingImage = Sprite.from("king");
    this.kingImage.anchor.set(0.5);

    this.kingImage.x = this.screenWidth / 2;
    // 화면 중앙 부분으로 이동 (화면 높이의 약 30% 지점)
    this.kingImage.y = this.screenHeight * 0.3;

    this.kingImage.width = 170;
    this.kingImage.height = 200;

    this.addChild(this.kingImage);
  }

  private createCongratulationText(): void {
    this.congratulationText = new Text({
      text: "축하해요!",
      style: {
        fontSize: 32,
        fill: 0x000000,
        align: "center",
      },
    });

    this.congratulationText.anchor.set(0.5);
    this.congratulationText.x = this.screenWidth / 2;
    // king 이미지에서 30px 아래
    this.congratulationText.y =
      this.kingImage.y + this.kingImage.height / 2 + 30;

    this.addChild(this.congratulationText);
  }

  private createRecordText(): void {
    this.recordText = new Text({
      text: "00초를 기록했어요",
      style: {
        fontSize: 32,
        fill: 0x000000,
        align: "center",
      },
    });

    this.recordText.anchor.set(0.5);
    this.recordText.x = this.screenWidth / 2;
    // 축하 텍스트에서 20px 아래 (간격을 좀 더 줄임)
    this.recordText.y = this.congratulationText.y + 40;

    this.addChild(this.recordText);
  }

  private createShareButton(): void {
    this.shareButton = new Graphics();

    this.shareButton.x = this.screenWidth / 2;
    this.shareButton.y = this.screenHeight - 80;

    this.shareButton.roundRect(-120, -25, 240, 50, 25);
    this.shareButton.fill(0x333333);

    this.shareButton.eventMode = "static";
    this.shareButton.cursor = "pointer";
    this.shareButton.on("pointerdown", this.onShareButtonClick.bind(this));

    this.shareButtonText = new Text({
      text: "친구에게 자랑하기",
      style: {
        fontSize: 20,
        fill: 0xffffff,
        align: "center",
      },
    });

    this.shareButtonText.anchor.set(0.5);
    this.shareButton.addChild(this.shareButtonText);

    this.addChild(this.shareButton);
  }

  private updateRecordText(): void {
    const formattedTime = this.formatTime(this.totalTime);
    this.recordText.text = `${formattedTime}를 기록했어요`;
  }

  private formatTime(seconds: number): string {
    return `${seconds.toFixed(1)}초`;
  }

  private onShareButtonClick(): void {
    console.log("🎉 친구에게 자랑하기 버튼 클릭!");

    // TODO: 실제 공유 기능 구현
  }

  public reset(): void {
    super.reset();

    // 결과 초기화
    this.totalTime = 0;
    this.updateRecordText();

    console.log("🔄 ResultScene reset complete");
  }

  public resume(): void {
    super.resume();
    console.log("▶️ ResultScene resumed");
  }

  public pause(): void {
    super.pause();
    console.log("⏸️ ResultScene paused");
  }
}
