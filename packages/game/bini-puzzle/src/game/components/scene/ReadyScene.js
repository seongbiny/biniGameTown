import { Container, Text } from 'pixi.js';
import { GameStatus } from '../../types';
import { TitleTextStyle } from '../../styles/TextStyles';
import { GAME_HEIGHT, GAME_WIDTH } from '../../../config/constants';
export default class ReadyScene {
    constructor(app, switchScene, gameState) {
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
        Object.defineProperty(this, "gameState", {
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
        Object.defineProperty(this, "readyTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "startTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.app = app;
        this.switchScene = switchScene;
        this.gameState = gameState;
        this.sceneContainer = new Container();
        this.init();
    }
    init() {
        // const sceneContainer = new Container();
        // Ready 텍스트 생성
        const readyText = new Text({
            text: 'Ready',
            style: TitleTextStyle(40),
        });
        readyText.anchor.set(0.5);
        readyText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        // Start 텍스트 생성 (초기에는 보이지 않음)
        const startText = new Text({
            text: 'Start!',
            style: TitleTextStyle(40),
        });
        startText.anchor.set(0.5);
        startText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        startText.visible = false;
        this.sceneContainer.addChild(readyText, startText);
        this.app.stage.addChild(this.sceneContainer);
        // 1초 후에 Ready 텍스트를 숨기고 Start 텍스트 표시
        this.readyTimer = setTimeout(() => {
            readyText.visible = false;
            startText.visible = true;
            // 추가로 1초 후에 PlayingScene으로 전환
            this.startTimer = setTimeout(() => {
                this.switchScene({
                    status: GameStatus.PLAYING,
                    selectedArtist: this.gameState.selectedArtist,
                    selectedMember: this.gameState.selectedMember,
                    gridSize: this.gameState.gridSize,
                });
            }, 1000);
        }, 1000);
    }
    cleanup() {
        // 타이머가 실행 중일 때 씬이 제거되는 것을 방지하기 위한 cleanup
        if (this.readyTimer)
            clearTimeout(this.readyTimer);
        if (this.startTimer)
            clearTimeout(this.startTimer);
        this.sceneContainer.removeChildren();
    }
}
