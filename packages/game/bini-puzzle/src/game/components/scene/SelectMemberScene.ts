import {
  Application,
  Text,
  Container,
  Graphics,
  Assets,
  Sprite,
} from 'pixi.js';
import { GameState, GameStatus } from '../../types';
import { TitleTextStyle } from '../../styles/TextStyles';
import Button from '../view/Button';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../../../config/constants';

export default class SelectMemberScene {
  private app: Application;
  private switchScene: (status: GameState) => void;
  private gameState: GameState;
  private sceneContainer: Container;
  private selectedMember: string = '';
  private selectedShape: Graphics | null = null;
  private shapes: Array<{
    shapeMask: Graphics;
    shape: Graphics;
    memberSprite: Sprite;
  }> = [];

  constructor(
    app: Application,
    switchScene: (status: GameState) => void,
    gameState: GameState
  ) {
    this.app = app;
    this.switchScene = switchScene;
    this.gameState = gameState;
    this.sceneContainer = new Container();
    this.init();
  }
  private async init() {
    const introText = new Text({
      text: '3.PLEASE\nSELECT THE\nMEMBER',
      style: TitleTextStyle(32),
    });

    introText.anchor.set(0.5);
    introText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 5);

    // 도형들을 담을 컨테이너 생성
    const shapesContainer = new Container();

    // 멤버 이미지 로드
    const minjiTexture = await Assets.load('assets/images/minji.jpg');
    const danielTexture = await Assets.load('assets/images/daniel.jpg');
    const haniTexture = await Assets.load('assets/images/hani.jpg');
    const haerinTexture = await Assets.load('assets/images/haerin.jpg');
    const hyeinTexture = await Assets.load('assets/images/hyein.jpg');

    // 도형 간 간격 설정
    const spacing = 20; // 도형 사이의 간격
    const shapeWidth = 162; // 도형의 너비

    // 도형들의 상대 위치 설정 (컨테이너 내부 좌표)
    // 첫 번째 행: 2개의 도형
    const shape1 = this.createShape(0, 0, minjiTexture, 'minji');
    const shape2 = this.createShape(
      shapeWidth + spacing,
      0,
      danielTexture,
      'daniel'
    );

    // 두 번째 행: 2개의 도형
    const shape3 = this.createShape(
      0,
      shapeWidth + spacing,
      haniTexture,
      'hani'
    );
    const shape4 = this.createShape(
      shapeWidth + spacing,
      shapeWidth + spacing,
      haerinTexture,
      'haerin'
    );

    // 세 번째 행: 1개의 도형
    const shape5 = this.createShape(
      0,
      2 * (shapeWidth + spacing),
      hyeinTexture,
      'hyein'
    );

    this.shapes = [shape1, shape2, shape3, shape4, shape5];

    // 모든 도형 요소를 shapesContainer에 추가
    shapesContainer.addChild(
      shape1.shapeMask,
      shape1.memberSprite,
      shape1.shape,
      shape2.shapeMask,
      shape2.memberSprite,
      shape2.shape,
      shape3.shapeMask,
      shape3.memberSprite,
      shape3.shape,
      shape4.shapeMask,
      shape4.memberSprite,
      shape4.shape,
      shape5.shapeMask,
      shape5.memberSprite,
      shape5.shape
    );

    // 도형들의 전체 영역 계산
    const totalWidth = 2 * shapeWidth + spacing; // 두 개의 도형과 간격
    const totalHeight = 3 * shapeWidth + 2 * spacing; // 세 행의 도형과 간격

    // 컨테이너 중앙 정렬
    shapesContainer.position.set(
      (GAME_WIDTH - totalWidth) / 2,
      (GAME_HEIGHT - totalHeight) / 2 + 100 // 제목 텍스트 고려하여 약간 아래로 조정
    );

    const buttonContainer = Button({
      width: 210,
      height: 50,
      text: 'Game Start!',
      fontSize: 28,
      fillColor: COLORS.SECONDARY,
      textColor: COLORS.BLACK,
      borderColor: COLORS.BLACK,
      borderWidth: 3,
      borderRadius: 10,
      onClick: () => {
        this.switchScene({
          status: GameStatus.READY,
          selectedArtist: this.gameState.selectedArtist,
          selectedMember: this.selectedMember,
          gridSize: this.gameState.gridSize,
        });
      },
    });

    buttonContainer.position.set(GAME_WIDTH / 2 - 100, GAME_HEIGHT - 55 - 50);

    buttonContainer.visible = false;

    // 씬 컨테이너에 요소들 추가
    this.sceneContainer.addChild(introText, shapesContainer, buttonContainer);

    this.app.stage.addChild(this.sceneContainer);
  }

  // 도형 생성 함수
  private createShape = (
    x: number,
    y: number,
    texture: any,
    memberName: string
  ) => {
    // 마스크용 도형 (테두리 없이 채우기만)
    const shapeMask = new Graphics()
      .fill({ color: COLORS.WHITE })
      .roundRect(0, 0, 162, 162, 16)
      .fill();
    shapeMask.position.set(x, y);

    // 이미지 추가
    const memberSprite = new Sprite(texture);
    memberSprite.anchor.set(0.5);

    // 이미지 크기 조정 (네모 안에 꽉 차게)
    const imageSize = 162;
    memberSprite.width = imageSize;
    memberSprite.height = imageSize;

    // 이미지 위치 설정 (네모 중앙)
    memberSprite.position.set(x + imageSize / 2, y + imageSize / 2);

    // 이미지에 마스크 적용
    memberSprite.mask = shapeMask;

    // 테두리용 도형 (채우기 없이 테두리만)
    const shape = new Graphics()
      .setStrokeStyle({ width: 2, color: 0x499edc })
      .roundRect(0, 0, 162, 162, 16)
      .stroke();

    if (memberName !== 'minji') {
      shape
        .fill({ color: COLORS.BLACK, alpha: 0.5 })
        .roundRect(0, 0, 162, 162, 16)
        .fill();

      // 클릭 이벤트 비활성화
      shape.eventMode = 'none';
      memberSprite.eventMode = 'none';
    } else {
      // 클릭 이벤트 설정
      shape.eventMode = 'static';
      shape.cursor = 'pointer';
      memberSprite.eventMode = 'static';
      memberSprite.cursor = 'pointer';
    }

    const handleClick = () => {
      if (this.selectedShape) {
        this.selectedShape.clear();
        this.selectedShape
          .setStrokeStyle({ width: 2, color: 0x499edc })
          .roundRect(0, 0, 162, 162, 16)
          .stroke();
      }

      shape.clear();
      shape
        .setStrokeStyle({ width: 3, color: COLORS.BLACK })
        .roundRect(0, 0, 162, 162, 16)
        .stroke();

      this.selectedShape = shape;
      this.selectedMember = memberName;

      const buttonContainer = this.sceneContainer.getChildAt(2) as Container;
      buttonContainer.visible = true;
    };

    shape.on('pointerdown', handleClick);
    memberSprite.on('pointerdown', handleClick);

    shape.position.set(x, y);

    return { shapeMask, shape, memberSprite };
  };

  public cleanup() {
    // 이벤트 리스너 제거
    this.shapes.forEach((shape) => {
      shape.shape.removeAllListeners();
      shape.memberSprite.removeAllListeners();
    });

    // 컨테이너 정리
    this.sceneContainer.removeChildren();
  }
}
