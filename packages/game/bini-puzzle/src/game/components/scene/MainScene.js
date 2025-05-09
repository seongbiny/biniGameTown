import { Assets, Container, Sprite, Text } from 'pixi.js';
import { GameStatus } from '../../types';
import { TitleTextStyle } from '../../styles/TextStyles';
import Button from '../view/Button';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../../../config/constants';
export default class MainScene {
    constructor(app, switchScene) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "switchScene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sceneContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
        this.switchScene = switchScene;
        this.sceneContainer = new Container();
        this.init();
    }
    async init() {
        const backgroundTexture = await Assets.load('assets/images/bubble.png');
        const background = new Sprite(backgroundTexture);
        background.width = GAME_WIDTH;
        background.height = GAME_HEIGHT;
        const titleText = new Text({
            text: 'THE \n BINI PUZZLE \n GAME',
            style: TitleTextStyle(40),
        });
        titleText.anchor.set(0.5);
        titleText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
        const buttonContainer = Button({
            width: 200,
            height: 50,
            text: 'Get in Start',
            fontSize: 28,
            fillColor: COLORS.SECONDARY,
            textColor: COLORS.BLACK,
            borderColor: COLORS.BLACK,
            borderWidth: 3,
            borderRadius: 10,
            onClick: () => this.switchScene({ status: GameStatus.SELECT_LEVEL }),
        });
        // 버튼 위치 설정 (제목 아래, 화면 중앙)
        buttonContainer.position.set(GAME_WIDTH / 2 - 100, // 버튼 너비의 절반을 빼서 중앙 정렬
        titleText.y + titleText.height / 2 + 50 // 제목 아래 50px 위치
        );
        this.sceneContainer.addChild(background, titleText, buttonContainer);
        this.app.stage.addChild(this.sceneContainer);
    }
    cleanup() {
        this.sceneContainer.removeChildren();
    }
}
