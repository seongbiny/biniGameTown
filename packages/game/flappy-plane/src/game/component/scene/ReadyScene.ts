import {
  Text,
  FederatedPointerEvent,
  Sprite,
  Container,
  Graphics,
} from 'pixi.js';
import { Scene } from './Scene';
import { DEFAULT_CONFIG } from '../../../config';
import SceneController from '../../core/SceneController';
import { SceneType } from '../../types';
const { GAME_WIDTH, GAME_HEIGHT } = DEFAULT_CONFIG;
export class ReadyScene extends Scene {
  public initialize() {
    super.initialize();
    this.addTitle();
    this.addPlane();
    this.addGround();
    this.addStartButton();
  }

  public reset(): void {
    this.removeChildren();

    this.addCommonBackground();

    this.addTitle();
    this.addPlane();
    this.addGround();
    this.addStartButton();
  }

  private addTitle() {
    const title = new Text({
      text: 'FLAPPY\nPLANE',
      style: {
        fontFamily: 'Chicalo',
        fontSize: 64,
        fontWeight: 'bold',
        fill: 0xffffff,
        stroke: { color: 0x2e343b, width: 5 },
        align: 'center',
        dropShadow: true,
      },
    });
    title.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 3);
    title.anchor.set(0.5);
    this.addChild(title);
  }

  private addPlane() {
    const plane = Sprite.from('plane');
    plane.anchor.set(0.5);
    plane.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);

    plane.width = 62;
    plane.height = 48;

    this.addChild(plane);
  }

  private addGround() {
    const ground = Sprite.from('ground');
    ground.anchor.set(0, 1);
    ground.position.set(0, GAME_HEIGHT);

    ground.width = GAME_WIDTH;

    this.addChild(ground);
  }

  private addStartButton() {
    const buttonContainer = new Container();
    buttonContainer.position.set(GAME_WIDTH / 2, GAME_HEIGHT - 162);
    buttonContainer.eventMode = 'static';
    buttonContainer.cursor = 'pointer';

    const buttonBackground = new Graphics();

    buttonBackground.fill({ color: 0xffd000 });
    buttonBackground.stroke({ color: 0x2e343b, width: 3 });
    buttonBackground.roundRect(-146 / 2, -62 / 2, 146, 62, 8);
    buttonBackground.fill();
    buttonBackground.stroke();

    const startText = new Text({
      text: 'START',
      style: {
        fontFamily: 'Chicalo',
        fontSize: 36,
        align: 'center',
        fill: 0x2e343b,
      },
    });
    startText.anchor.set(0.5);

    // 버튼 컨테이너에 배경과 텍스트 추가
    buttonContainer.addChild(buttonBackground);
    buttonContainer.addChild(startText);

    // 버튼 클릭 이벤트 처리
    buttonContainer.on('pointerdown', this.handlePointerDown.bind(this));

    // 씬에 버튼 컨테이너 추가
    this.addChild(buttonContainer);
  }

  private handlePointerDown(event: FederatedPointerEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    // PlayingScene으로 전환
    SceneController.getInstance().switchScene(SceneType.PLAYING);
  }
}
