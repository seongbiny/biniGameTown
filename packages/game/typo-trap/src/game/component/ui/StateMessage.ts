import { Container, Text } from "pixi.js";

export interface StateMessageConfig {
  screenWidth: number;
  screenHeight: number;
  gridTopY: number;
}

export class StateMessage extends Container {
  private config: StateMessageConfig;

  // UI 요소들 (메시지만)
  private topMessageText!: Text;
  private bottomMessageText!: Text;

  constructor(config: StateMessageConfig) {
    super();
    this.config = config;
    this.createUI();
  }

  private createUI(): void {
    this.createTopMessage();
    this.createBottomMessage();
    this.hide();
  }

  private createTopMessage(): void {
    this.topMessageText = new Text("", {
      fontFamily: "Pretendard",
      fontSize: 24,
      fill: 0x000000,
      align: "center",
      fontWeight: "600" as any,
    });
    this.topMessageText.anchor.set(0.5);
    this.topMessageText.x = this.config.screenWidth / 2;
    this.topMessageText.y = this.config.gridTopY / 2;
    this.topMessageText.visible = false;
    this.addChild(this.topMessageText);
  }

  private createBottomMessage(): void {
    this.bottomMessageText = new Text("", {
      fontFamily: "Pretendard",
      fontSize: 24,
      fill: 0x000000,
      align: "center",
      fontWeight: "600" as any,
    });
    this.bottomMessageText.anchor.set(0.5);
    this.bottomMessageText.x = this.config.screenWidth / 2;
    this.bottomMessageText.y = this.config.screenHeight - 120;
    this.bottomMessageText.visible = false;
    this.addChild(this.bottomMessageText);
  }

  public showTopMessage(message: string): void {
    this.topMessageText.text = message;
    this.topMessageText.visible = true;
  }

  public showBottomMessage(message: string): void {
    this.bottomMessageText.text = message;
    this.bottomMessageText.visible = true;
  }

  public hideTopMessage(): void {
    this.topMessageText.visible = false;
  }

  public hideBottomMessage(): void {
    this.bottomMessageText.visible = false;
  }

  public hide(): void {
    this.hideTopMessage();
    this.hideBottomMessage();
  }

  public reset(): void {
    this.hide();
    console.log("🔄 StateMessage reset complete");
  }

  public updateLayout(config: StateMessageConfig): void {
    this.config = config;
    this.topMessageText.x = config.screenWidth / 2;
    this.topMessageText.y = config.gridTopY / 2;
    this.bottomMessageText.x = config.screenWidth / 2;
    this.bottomMessageText.y = config.screenHeight - 120;
  }
}
