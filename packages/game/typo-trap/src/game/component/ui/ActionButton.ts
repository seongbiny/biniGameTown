import { Container, Graphics, Text } from "pixi.js";

export interface ActionButtonConfig {
  x: number;
  y: number;
  width?: number;
  height?: number;
  backgroundColor?: number;
  borderColor?: number;
  borderWidth?: number;
  borderRadius?: number;
  text: string;
  textColor?: number;
  fontSize?: number;
  fontWeight?: string;
}

export interface ActionButtonCallbacks {
  onClick: (action: string, button: ActionButton) => void;
}

export const ButtonStyle = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
} as const;

export type ButtonStyle = (typeof ButtonStyle)[keyof typeof ButtonStyle];

export class ActionButton extends Container {
  private background!: Graphics;
  private textElement!: Text;
  private config: ActionButtonConfig;
  private callbacks: ActionButtonCallbacks;
  private action: string = "";
  private isEnabled: boolean = true;

  // 기본 스타일 정의
  private readonly defaultStyles: Record<
    ButtonStyle,
    Partial<ActionButtonConfig>
  > = {
    [ButtonStyle.PRIMARY]: {
      backgroundColor: 0x353739,
      borderColor: 0x353739,
      textColor: 0xffffff,
    },
    [ButtonStyle.SECONDARY]: {
      backgroundColor: 0x666666,
      borderColor: 0x666666,
      textColor: 0xffffff,
    },
    [ButtonStyle.SUCCESS]: {
      backgroundColor: 0x28a745,
      borderColor: 0x28a745,
      textColor: 0xffffff,
    },
    [ButtonStyle.WARNING]: {
      backgroundColor: 0xff9800,
      borderColor: 0xff9800,
      textColor: 0xffffff,
    },
    [ButtonStyle.DANGER]: {
      backgroundColor: 0xdc3545,
      borderColor: 0xdc3545,
      textColor: 0xffffff,
    },
  };

  constructor(config: ActionButtonConfig, callbacks: ActionButtonCallbacks) {
    super();

    // 기본값 설정
    this.config = {
      width: 410,
      height: 50,
      backgroundColor: 0x353739,
      borderColor: 0x353739,
      borderWidth: 2,
      borderRadius: 10,
      textColor: 0xffffff,
      fontSize: 20,
      fontWeight: "600",
      ...config,
    };

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
      fontSize: this.config.fontSize!,
      fill: this.config.textColor!,
      align: "center",
      fontWeight: this.config.fontWeight! as any,
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

    const halfWidth = this.config.width! / 2;
    const halfHeight = this.config.height! / 2;

    this.background.roundRect(
      -halfWidth,
      -halfHeight,
      this.config.width!,
      this.config.height!,
      this.config.borderRadius!
    );
    this.background.fill(this.config.backgroundColor!);
    this.background.stroke({
      width: this.config.borderWidth!,
      color: this.config.borderColor!,
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

  public setStyle(style: ButtonStyle): void {
    const styleConfig = this.defaultStyles[style];
    this.updateConfig(styleConfig);
  }

  public updateConfig(partialConfig: Partial<ActionButtonConfig>): void {
    this.config = { ...this.config, ...partialConfig };

    // 텍스트 스타일 업데이트
    if (partialConfig.text !== undefined) {
      this.textElement.text = partialConfig.text;
    }
    if (partialConfig.textColor !== undefined) {
      this.textElement.style.fill = partialConfig.textColor;
    }
    if (partialConfig.fontSize !== undefined) {
      this.textElement.style.fontSize = partialConfig.fontSize;
    }
    if (partialConfig.fontWeight !== undefined) {
      this.textElement.style.fontWeight = partialConfig.fontWeight as any;
    }

    // 위치 업데이트
    if (partialConfig.x !== undefined || partialConfig.y !== undefined) {
      this.x = this.config.x;
      this.y = this.config.y;
    }

    // 버튼 재렌더링
    this.renderButton();
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

  // 빠른 생성 팩토리 메서드들
  public static createPrimary(
    text: string,
    x: number,
    y: number,
    action: string,
    callbacks: ActionButtonCallbacks
  ): ActionButton {
    const button = new ActionButton({ text, x, y }, callbacks);
    button.setStyle(ButtonStyle.PRIMARY);
    button.setAction(action);
    return button;
  }

  public static createSecondary(
    text: string,
    x: number,
    y: number,
    action: string,
    callbacks: ActionButtonCallbacks
  ): ActionButton {
    const button = new ActionButton({ text, x, y }, callbacks);
    button.setStyle(ButtonStyle.SECONDARY);
    button.setAction(action);
    return button;
  }

  public static createWarning(
    text: string,
    x: number,
    y: number,
    action: string,
    callbacks: ActionButtonCallbacks
  ): ActionButton {
    const button = new ActionButton({ text, x, y }, callbacks);
    button.setStyle(ButtonStyle.WARNING);
    button.setAction(action);
    return button;
  }

  public static createSuccess(
    text: string,
    x: number,
    y: number,
    action: string,
    callbacks: ActionButtonCallbacks
  ): ActionButton {
    const button = new ActionButton({ text, x, y }, callbacks);
    button.setStyle(ButtonStyle.SUCCESS);
    button.setAction(action);
    return button;
  }

  public static createDanger(
    text: string,
    x: number,
    y: number,
    action: string,
    callbacks: ActionButtonCallbacks
  ): ActionButton {
    const button = new ActionButton({ text, x, y }, callbacks);
    button.setStyle(ButtonStyle.DANGER);
    button.setAction(action);
    return button;
  }
}
