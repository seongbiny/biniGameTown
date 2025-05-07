import { Application, Container, Graphics, Text } from 'pixi.js';
import { GameState, GameStatus } from '../../types';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../../../config/constants';
import { ButtonTextStyle, SubtitleTextStyle } from '../../styles/TextStyles';

export default class GameOverScene {
  private app: Application;
  private switchScene: (status: GameState) => void;
  private gameState: GameState;
  private sceneContainer: Container;

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

  private init() {
    const moves = this.gameState.moves || 0;
    const time = this.gameState.time || 0;

    const resultText = new Text({
      text: `moves: ${moves}\ntime: ${time}s`,
      style: SubtitleTextStyle(48),
    });

    resultText.anchor.set(0.5);
    resultText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);

    const buttonContainer = new Container();

    const buttonWidth = 125;
    const buttonHeight = 50;

    const buttonBackground = new Graphics()
      .fill({ color: COLORS.SECONDARY })
      .setStrokeStyle({ width: 3, color: COLORS.BLACK })
      .roundRect(0, 0, buttonWidth, buttonHeight, 10)
      .fill()
      .stroke();

    const buttonText = new Text({
      text: 'Retry',
      style: ButtonTextStyle(28),
    });

    buttonText.anchor.set(0.5);
    buttonText.position.set(buttonWidth / 2, buttonHeight / 2);

    buttonContainer.addChild(buttonBackground, buttonText);

    buttonContainer.position.set(
      GAME_WIDTH / 2 - buttonWidth / 2,
      GAME_HEIGHT / 2 + 20
    );

    buttonBackground.eventMode = 'static';
    buttonBackground.cursor = 'pointer';
    buttonBackground.on('pointerdown', () => {
      this.switchScene({
        status: GameStatus.MAIN,
      });
    });

    this.sceneContainer.addChild(resultText, buttonContainer);
    this.app.stage.addChild(this.sceneContainer);
  }
  public cleanup() {
    this.sceneContainer.removeChildren();
  }
}
