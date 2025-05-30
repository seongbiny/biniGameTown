import { Container, Graphics, Text } from "pixi.js";

export interface ActionButtonConfig {
  x: number;
  y: number;
  text: string;
}

export interface ActionButtonCallbacks {
  onClick: (action: string, button: ActionButton) => void;
}

export class ActionButton extends Container {
  private background!: Graphics;
  private textElement!: Text;
  private config: ActionButtonConfig;
  private callbacks: ActionButtonCallbacks;
  private action: string = "";
  private isEnabled: boolean = true;

  // 고정 스타일 값들
  private readonly buttonWidth = 410;
  private readonly buttonHeight = 50;
  private readonly backgroundColor = 0x353739;
  private readonly borderColor = 0x353739;
  private readonly borderWidth = 2;
  private readonly borderRadius = 10;
  private readonly textColor = 0xffffff;
  private readonly fontSize = 20;

  constructor(config: ActionButtonConfig, callbacks: ActionButtonCallbacks) {
    super();
    this.config = config;
    this.callbacks = callbacks;

    this.createButton();
    this.setupInteraction();
  }

  private createButton(): void {
    // 배경 생성
    this.background = new Graphics();
    this.addChild(this.background);

    // 텍스트 생성
    this.textElement = new Text(this.config.text, {
      fontFamily: "Pretendard",
      fontSize: this.fontSize,
      fill: this.textColor,
      align: "center",
      fontWeight: "600" as any,
    });
    this.textElement.anchor.set(0.5);
    this.textElement.x = 0;
    this.textElement.y = 0;
    this.addChild(this.textElement);

    // 위치 설정
    this.x = this.config.x;
    this.y = this.config.y;

    // 초기 스타일 적용
    this.renderButton();
  }

  private setupInteraction(): void {
    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", this.onClick.bind(this));
  }

  private onClick(): void {
    if (!this.isEnabled) {
      console.log("🚫 ActionButton is disabled");
      return;
    }

    console.log(
      `🔘 ActionButton clicked: "${this.config.text}" (${this.action})`
    );
    this.callbacks.onClick(this.action, this);
  }

  private renderButton(): void {
    this.background.clear();

    const halfWidth = this.buttonWidth / 2;
    const halfHeight = this.buttonHeight / 2;

    this.background.roundRect(
      -halfWidth,
      -halfHeight,
      this.buttonWidth,
      this.buttonHeight,
      this.borderRadius
    );
    this.background.fill(this.backgroundColor);
    this.background.stroke({
      width: this.borderWidth,
      color: this.borderColor,
    });
  }
  // Public API 메서드들
  public setText(text: string): void {
    this.config.text = text;
    this.textElement.text = text;
  }

  public setAction(action: string): void {
    this.action = action;
  }

  public setPosition(x: number, y: number): void {
    this.config.x = x;
    this.config.y = y;
    this.x = x;
    this.y = y;
  }

  public enable(): void {
    this.isEnabled = true;
    this.eventMode = "static";
    this.cursor = "pointer";
    this.alpha = 1.0;
  }

  public disable(): void {
    this.isEnabled = false;
    this.eventMode = "none";
    this.cursor = "default";
    this.alpha = 0.6;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public isButtonEnabled(): boolean {
    return this.isEnabled;
  }

  public getAction(): string {
    return this.action;
  }

  public getText(): string {
    return this.config.text;
  }

  public reset(): void {
    this.hide();
    this.action = "";
    this.setText("");
    console.log("🔄 ActionButton reset complete");
  }
}
