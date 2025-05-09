import { Container, Sprite } from 'pixi.js';
import { DEFAULT_CONFIG } from '../../../config';
const { GAME_WIDTH, GAME_HEIGHT } = DEFAULT_CONFIG;
export class Scene extends Container {
    // 씬 객체를 생성할 때 호출되는 생성자
    constructor(parent) {
        super(); // Container 클래스의 생성자를 실행
        Object.defineProperty(this, "screenWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // protexted로 선언하면 자식 클래스에서만 접근 가능
        Object.defineProperty(this, "screenHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isEnable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // 씬이 활성화 상태인지 나타내는 값
        Object.defineProperty(this, "isInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // 씬이 초기화 되었는지 나타내는 값
        this.screenWidth = GAME_WIDTH;
        this.screenHeight = GAME_HEIGHT;
        parent.addChild(this); // 현재 씬을 부모 컨테이너에 추가
    }
    // 씬을 초기화
    initialize() {
        this.isInitialized = true;
        this.addCommonBackground();
    }
    // 모든 씬에 공통적으로 사용될 배경을 추가
    addCommonBackground() {
        const background = Sprite.from('background');
        background.position.set(this.screenWidth / 2, this.screenHeight / 2);
        background.anchor.set(0.5);
        background.width = this.screenWidth;
        background.height = this.screenHeight;
        this.addChild(background);
    }
    // 씬을 재설정하는 메서드. 자식 클래스에서 오버라이드하여 구현 가능
    reset() { }
    // 매 프레임마다 호출되는 업데이트 메서드
    // 매개변수는 이전 프레임과 현재 프레임 사이의 경과 시간
    update(_deltaTime) { }
    // 씬을 일시 중지하는 메서드
    // isEnable을 false로 설정하여 업데이트가 호출되지 않도록 함
    pause() {
        this.isEnable = false;
    }
    // 씬을 재개하는 메서드
    resume() {
        this.isEnable = true;
    }
}
