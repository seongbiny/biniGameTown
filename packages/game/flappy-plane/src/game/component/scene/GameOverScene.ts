import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Sprite,
  Text,
} from 'pixi.js';
import { Scene } from './Scene';
import { DEFAULT_CONFIG } from '../../../config';
import SceneController from '../../core/SceneController';
import { SceneType } from '../../types';
import { ScoreManager } from '../view/ScoreManager';
import { GameController } from '../../core/GameController';

const { GAME_WIDTH, GAME_HEIGHT } = DEFAULT_CONFIG;
export class GameOverScene extends Scene {
  private scoreValue!: Text;
  private bestValue!: Text;
  private scoreManager: ScoreManager;

  constructor(parent: Container) {
    super(parent);
    this.scoreManager = ScoreManager.getInstance();

    this.scoreManager.on('scoreChanged', this.updateScoreDisplay.bind(this));
    this.scoreManager.on(
      'highScoreChanged',
      this.updateScoreDisplay.bind(this)
    );
  }

  public initialize() {
    super.initialize();
    this.addGround();
    this.addTitle();
    this.addGameOverUI();
    this.addRetryButton();
    this.updateScoreDisplay();
  }

  private updateScoreDisplay() {
    if (this.scoreValue) {
      const currentScore = this.scoreManager.getScore();
      this.scoreValue.text = currentScore.toString();
    }

    if (this.bestValue) {
      this.bestValue.text = this.scoreManager.getHighScore().toString();
    }
  }

  private addGameOverUI() {
    const box = new Graphics();

    const boxWidth = 335;
    const boxHeight = 200;
    const boxX = (GAME_WIDTH - boxWidth) / 2;
    const boxY = (GAME_HEIGHT - boxHeight) / 2;

    box.fill({ color: 0x97714a });
    box.stroke({ color: 0x2e343b, width: 2 });
    box.roundRect(boxX, boxY, boxWidth, boxHeight, 4);
    box.fill();
    box.stroke();

    const dividerWidth = 4;
    const dividerHeight = 56;
    const divider = new Graphics();
    divider.fill({ color: 0x61482e });
    divider.rect(
      boxX + boxWidth / 2 - dividerWidth / 2,
      boxY + (boxHeight - dividerHeight) / 2,
      dividerWidth,
      dividerHeight
    );
    divider.fill();

    const scoreLabel = new Text({
      text: 'SCORE',
      style: {
        fontFamily: 'Chicalo',
        fontSize: 36,
        fill: 0xffffff,
        stroke: { color: 0x000000, width: 6 },
        align: 'center',
      },
    });
    scoreLabel.anchor.set(0.5);
    scoreLabel.position.set(boxX + boxWidth * 0.25, boxY + boxHeight * 0.35);

    this.scoreValue = new Text({
      text: this.scoreManager.getScore().toString(),
      style: {
        fontFamily: 'Chicalo',
        fontSize: 28,
        fill: 0xffffff,
        stroke: { color: 0x000000, width: 6 },
        align: 'center',
      },
    });
    this.scoreValue.anchor.set(0.5);
    this.scoreValue.position.set(
      boxX + boxWidth * 0.25,
      boxY + boxHeight * 0.6
    );

    const bestLabel = new Text({
      text: 'BEST',
      style: {
        fontFamily: 'Chicalo',
        fontSize: 36,
        fill: 0xffd000,
        stroke: { color: 0x000000, width: 6 },
        align: 'center',
      },
    });
    bestLabel.anchor.set(0.5);
    bestLabel.position.set(boxX + boxWidth * 0.75, boxY + boxHeight * 0.35);

    const bestValue = new Text({
      text: this.scoreManager.getHighScore().toString(),
      style: {
        fontFamily: 'Chicalo',
        fontSize: 28,
        fill: 0xffd000,
        stroke: { color: 0x000000, width: 6 },
        align: 'center',
      },
    });
    bestValue.anchor.set(0.5);
    bestValue.position.set(boxX + boxWidth * 0.75, boxY + boxHeight * 0.6);

    this.bestValue = bestValue;

    this.addChild(
      box,
      divider,
      scoreLabel,
      this.scoreValue,
      bestLabel,
      this.bestValue
    );
  }

  private addTitle() {
    const title = new Text({
      text: 'GAME OVER',
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
    title.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 4);
    title.anchor.set(0.5);
    this.addChild(title);
  }

  private addGround() {
    const ground = Sprite.from('ground');
    ground.anchor.set(0, 1);
    ground.position.set(0, GAME_HEIGHT);

    ground.width = GAME_WIDTH;

    this.addChild(ground);
  }

  private addRetryButton() {
    const buttonContainer = new Container();
    buttonContainer.eventMode = 'static';
    buttonContainer.cursor = 'pointer';

    const boxHeight = 200;
    const boxY = (GAME_HEIGHT - boxHeight) / 2;

    const buttonWidth = 150;
    const buttonHeight = 60;
    const buttonX = GAME_WIDTH / 2 - buttonWidth / 2;
    const buttonY = boxY + boxHeight + 60; // 게임오버 박스 아래 60픽셀 떨어진 위치

    const buttonBackground = new Graphics();
    buttonBackground.fill({ color: 0xff4800 });
    buttonBackground.stroke({ color: 0x000000, width: 3 });
    buttonBackground.roundRect(0, 0, buttonWidth, buttonHeight, 8);
    buttonBackground.fill();
    buttonBackground.stroke();

    const retryText = new Text({
      text: 'RETRY',
      style: {
        fontFamily: 'Chicalo',
        fontSize: 36,
        fill: 0xffffff,
        align: 'center',
      },
    });
    retryText.anchor.set(0.5);
    retryText.position.set(buttonWidth / 2, buttonHeight / 2);

    buttonContainer.addChild(buttonBackground, retryText);

    buttonContainer.position.set(buttonX, buttonY);

    buttonContainer.on('pointerdown', this.handleRetryClick.bind(this));

    this.addChild(buttonContainer);
  }

  private handleRetryClick(_event: FederatedPointerEvent) {
    // this.scoreManager.resetScore();
    GameController.getInstance().resetGame();
    SceneController.getInstance().switchScene(SceneType.READY);
  }
}
