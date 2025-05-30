import { Container } from "pixi.js";

export class Scene extends Container {
  protected screenWidth: number;
  protected screenHeight: number;
  public isEnable: boolean = false;
  public isInitialized: boolean = false;

  constructor(parent: Container) {
    super();
    this.screenWidth = 450;
    this.screenHeight = 800;

    parent.addChild(this);
  }

  // 씬을 초기화
  public initialize() {
    this.isInitialized = true;
    this.addCommonBackground();
  }

  // 모든 씬에 공통적으로 사용될 배경을 추가
  protected addCommonBackground() {
    // const background = Sprite.from("background");
    // background.position.set(this.screenWidth / 2, this.screenHeight / 2);
    // background.anchor.set(0.5);
    // background.width = this.screenWidth;
    // background.height = this.screenHeight;
    // this.addChild(background);
  }

  // 씬을 재설정하는 메서드. 자식 클래스에서 오버라이드하여 구현 가능
  public reset(): void {}

  // 매 프레임마다 호출되는 업데이트 메서드
  // 매개변수는 이전 프레임과 현재 프레임 사이의 경과 시간
  public update(_deltaTime: number): void {}

  // 씬을 일시 중지하는 메서드
  // isEnable을 false로 설정하여 업데이트가 호출되지 않도록 함
  public pause(): void {
    this.isEnable = false;
  }

  // 씬을 재개하는 메서드
  public resume(): void {
    this.isEnable = true;
  }
}
