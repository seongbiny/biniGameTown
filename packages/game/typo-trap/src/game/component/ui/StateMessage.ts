import { Container, Graphics, Text } from "pixi.js";

export interface StateMessageConfig {
  screenWidth: number;
  screenHeight: number;
  gridTopY: number; // 그리드 상단 위치 (메시지 위치 계산용)
}

export interface StateMessageCallbacks {
  onButtonClick: (action: string) => void;
}

export const MessageType = {
  SUCCESS: "success",
  ERROR: "error",
  NEXT_STAGE: "next_stage",
  TIMEOUT: "timeout",
  WRONG: "wrong",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface MessageData {
  type: MessageType;
  topMessage?: string;
  bottomMessage?: string;
  buttonText?: string;
  buttonColor?: number;
  action?: string; // 버튼 클릭 시 전달할 액션
}

export class StateMessage extends Container {
  private config: StateMessageConfig;
  private callbacks: StateMessageCallbacks;

  // UI 요소들
  private topMessageText!: Text;
  private bottomUIContainer!: Container;
  private bottomMessageText!: Text;
  private actionButton!: Graphics;
  private buttonText!: Text;

  private currentAction: string = "";

  constructor(config: StateMessageConfig, callbacks: StateMessageCallbacks) {
    super();
    this.config = config;
    this.callbacks = callbacks;

    this.createUI();
  }

  private createUI(): void {
    this.createTopMessage();
    this.createBottomUI();
    this.hide();
  }

  private createTopMessage(): void {
    this.topMessageText = new Text({
      text: "",
      style: {
        fontFamily: "Pretendard",
        fontSize: 24,
        fill: 0x000000,
        align: "center",
        fontWeight: "600",
      },
    });
    this.topMessageText.anchor.set(0.5);
    this.topMessageText.x = this.config.screenWidth / 2;

    // 그리드와 화면 상단 사이의 가운데 위치
    const messageY = this.config.gridTopY / 2;
    this.topMessageText.y = messageY;

    this.topMessageText.visible = false;
    this.addChild(this.topMessageText);
  }

  private createBottomUI(): void {
    this.bottomUIContainer = new Container();
    this.addChild(this.bottomUIContainer);

    // 하단 메시지 텍스트
    this.bottomMessageText = new Text({
      text: "",
      style: {
        fontFamily: "Pretendard",
        fontSize: 24,
        fill: 0x000000,
        align: "center",
        fontWeight: "600",
      },
    });
    this.bottomMessageText.anchor.set(0.5);
    this.bottomMessageText.x = this.config.screenWidth / 2;
    this.bottomMessageText.y = this.config.screenHeight - 120;
    this.bottomUIContainer.addChild(this.bottomMessageText);

    // 액션 버튼
    this.actionButton = new Graphics();
    this.actionButton.x = this.config.screenWidth / 2;
    this.actionButton.y = this.config.screenHeight - 60;
    this.actionButton.eventMode = "static";
    this.actionButton.cursor = "pointer";
    this.actionButton.on("pointerdown", this.onButtonClick.bind(this));
    this.bottomUIContainer.addChild(this.actionButton);

    // 버튼 텍스트
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

    this.bottomUIContainer.visible = false;
  }

  public showMessage(data: MessageData): void {
    console.log(`📝 StateMessage showing: ${data.type}`, data);

    // 상단 메시지 처리
    if (data.topMessage) {
      this.topMessageText.text = data.topMessage;
      this.topMessageText.visible = true;
    } else {
      this.topMessageText.visible = false;
    }

    // 하단 UI 처리
    if (data.buttonText) {
      // 하단 메시지 (보통 비어있음)
      if (data.bottomMessage && data.bottomMessage.trim() !== "") {
        this.bottomMessageText.text = data.bottomMessage;
        this.bottomMessageText.visible = true;
      } else {
        this.bottomMessageText.visible = false;
      }

      // 버튼 스타일링
      this.actionButton.clear();
      this.actionButton.roundRect(-205, -25, 410, 50, 10);
      this.actionButton.fill(data.buttonColor || 0x353739);
      this.actionButton.stroke({
        width: 2,
        color: data.buttonColor || 0x353739,
      });

      this.buttonText.text = data.buttonText;
      this.buttonText.style.fill = 0xffffff;
      this.buttonText.style.fontSize = 20;

      this.currentAction = data.action || data.type;
      this.bottomUIContainer.visible = true;
    } else {
      this.bottomUIContainer.visible = false;
    }
  }

  public showSuccessMessage(message: string): void {
    this.showMessage({
      type: MessageType.SUCCESS,
      topMessage: message,
    });
  }

  public showNextStageMessage(
    topMessage: string,
    buttonText: string,
    action: string = "next_stage"
  ): void {
    this.showMessage({
      type: MessageType.NEXT_STAGE,
      topMessage,
      buttonText,
      buttonColor: 0x353739,
      action,
    });
  }

  public showErrorMessage(
    topMessage: string,
    buttonText: string,
    action: string = "retry"
  ): void {
    this.showMessage({
      type: MessageType.ERROR,
      topMessage,
      buttonText,
      buttonColor: 0x666666,
      action,
    });
  }

  public showTimeoutMessage(topMessage: string, buttonText: string): void {
    this.showMessage({
      type: MessageType.TIMEOUT,
      topMessage,
      buttonText,
      buttonColor: 0xff9800,
      action: "retry",
    });
  }

  public showWrongMessage(topMessage: string, buttonText: string): void {
    this.showMessage({
      type: MessageType.WRONG,
      topMessage,
      buttonText,
      buttonColor: 0x666666,
      action: "retry",
    });
  }

  public hide(): void {
    this.topMessageText.visible = false;
    this.bottomUIContainer.visible = false;
    console.log("📝 StateMessage hidden");
  }

  public hideTopMessage(): void {
    this.topMessageText.visible = false;
  }

  public hideBottomUI(): void {
    this.bottomUIContainer.visible = false;
  }

  private onButtonClick(): void {
    console.log(`🔘 StateMessage button clicked: ${this.currentAction}`);
    this.callbacks.onButtonClick(this.currentAction);
  }

  public updateLayout(config: StateMessageConfig): void {
    this.config = config;

    // 상단 메시지 위치 업데이트
    this.topMessageText.x = config.screenWidth / 2;
    const messageY = config.gridTopY / 2;
    this.topMessageText.y = messageY;

    // 하단 UI 위치 업데이트
    this.bottomMessageText.x = config.screenWidth / 2;
    this.bottomMessageText.y = config.screenHeight - 120;

    this.actionButton.x = config.screenWidth / 2;
    this.actionButton.y = config.screenHeight - 60;
  }

  public reset(): void {
    this.hide();
    this.currentAction = "";
    console.log("🔄 StateMessage reset complete");
  }
}
