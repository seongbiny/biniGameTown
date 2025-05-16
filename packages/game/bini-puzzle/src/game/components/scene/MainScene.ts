import { Application, Assets, Container, Sprite, Text } from "pixi.js";
import { GameState, GameStatus } from "../../types";
import { TitleTextStyle } from "../../styles/TextStyles";
import Button from "../view/Button";
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from "../../../config/constants";

export default class MainScene {
  private app: Application;
  private switchScene: (status: GameState) => void;
  private sceneContainer: Container;

  constructor(app: Application, switchScene: (status: GameState) => void) {
    this.app = app;
    this.switchScene = switchScene;
    this.sceneContainer = new Container();
    this.init();
  }

  private async init() {
    const backgroundTexture = await Assets.load("assets/images/bubble.png");
    const background = new Sprite(backgroundTexture);

    background.width = GAME_WIDTH;
    background.height = GAME_HEIGHT;

    const titleText = new Text({
      text: "THE \n BINI PUZZLE \n GAME",
      style: TitleTextStyle(40),
    });

    titleText.anchor.set(0.5);
    titleText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);

    // 로그인 버튼
    const signInButton = Button({
      width: 200,
      height: 50,
      text: "SignIn",
      fontSize: 28,
      fillColor: COLORS.SECONDARY,
      textColor: COLORS.BLACK,
      borderColor: COLORS.BLACK,
      borderWidth: 3,
      borderRadius: 10,
      onClick: () => this.switchScene({ status: GameStatus.SIGN_IN }),
    });

    // 회원가입 버튼
    const signUpButton = Button({
      width: 200,
      height: 50,
      text: "SignUp",
      fontSize: 28,
      fillColor: COLORS.SECONDARY,
      textColor: COLORS.BLACK,
      borderColor: COLORS.BLACK,
      borderWidth: 3,
      borderRadius: 10,
      onClick: () => this.switchScene({ status: GameStatus.SIGN_UP }),
    });

    // 게스트 시작 버튼
    const guestButton = Button({
      width: 200,
      height: 50,
      text: "Start as a guest",
      fontSize: 24, // 텍스트가 길어서 폰트 크기 조정
      fillColor: COLORS.SECONDARY,
      textColor: COLORS.BLACK,
      borderColor: COLORS.BLACK,
      borderWidth: 3,
      borderRadius: 10,
      onClick: () => this.switchScene({ status: GameStatus.SELECT_LEVEL }),
    });

    // 버튼 위치 설정
    const startY = titleText.y + titleText.height / 2 + 30;
    const buttonSpacing = 70; // 버튼 간격

    signInButton.position.set(GAME_WIDTH / 2 - 100, startY);
    signUpButton.position.set(GAME_WIDTH / 2 - 100, startY + buttonSpacing);
    guestButton.position.set(GAME_WIDTH / 2 - 100, startY + buttonSpacing * 2);

    this.sceneContainer.addChild(
      background,
      titleText,
      signInButton,
      signUpButton,
      guestButton
    );

    this.app.stage.addChild(this.sceneContainer);
  }

  public cleanup() {
    this.sceneContainer.removeChildren();
  }
}
