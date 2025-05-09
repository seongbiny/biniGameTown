import { Ticker } from 'pixi.js';
import { SceneType } from '../types';
import { ReadyScene } from '../component/scene/ReadyScene';
import { PlayingScene } from '../component/scene/PlayingScene';
import { GameOverScene } from '../component/scene/GameOverScene';
class SceneController {
    constructor() {
        // Ticker는 게임 루프를 관리하는 객체, 매 프레임마다 특정 함수를 호출
        Object.defineProperty(this, "ticker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Ticker()
        });
        // 씬 유형과 씬 객체를 매핑하는 맵을 생성
        Object.defineProperty(this, "sceneMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // 모든 씬이 추가될 메인 컨테이너
        // !는 TS에게 이 변수가 반드시 초기화 될 것임을 알려주는 표시
        Object.defineProperty(this, "stage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentScene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: SceneType.READY
        });
    }
    // 싱글톤 패턴의 핵심 메서드, SceneController 인스턴스를 얻는 정적 메서드
    // 인스턴스가 없으면 새로 생성하고 이미 있으면 기존 인스턴스를 반환
    // 이 패턴은 애플리케이션 전체에서 SceneController의 인스턴스가 단 하나만 존재하도록 보장
    static getInstance() {
        if (!SceneController.instance) {
            SceneController.instance = new SceneController();
        }
        return SceneController.instance;
    }
    // SceneController 초기화하는 메서드
    initialize(stage) {
        // 매개변수를 클래스의 stage 변수에 할당
        this.stage = stage;
        // 모든 씬을 초기화
        this.initializeScene();
        this.switchScene(SceneType.READY);
        // Ticker를 일시 중지하고 update 메서드를 Ticker에 추가한 후 다시 시작
        this.ticker.stop();
        // update 메서드가 호출될 때 this 컨텍스트가 SceneController 인스턴스를 가리키도록 함
        this.ticker.add(this.update.bind(this));
        this.ticker.start();
    }
    // 모든 씬을 생성하고 sceneMap에 추가
    initializeScene() {
        this.sceneMap.set(SceneType.READY, new ReadyScene(this.stage));
        this.sceneMap.set(SceneType.PLAYING, new PlayingScene(this.stage));
        this.sceneMap.set(SceneType.GAMEOVER, new GameOverScene(this.stage));
    }
    // 현재 씬을 다른 씬으로 전환하는 메서드
    switchScene(sceneType) {
        if (!this.stage)
            return;
        const oldScene = this.sceneMap.get(this.currentScene);
        if (oldScene) {
            oldScene.pause(); // pause 가 맞나? reset?
            this.stage.removeChild(oldScene);
        }
        this.currentScene = sceneType;
        const newScene = this.sceneMap.get(this.currentScene);
        if (newScene) {
            if (!newScene.isInitialized) {
                newScene.initialize();
            }
            else {
                newScene.reset();
            }
            newScene.resume();
            this.stage.addChild(newScene);
        }
    }
    update(ticker) {
        const deltaTime = ticker.deltaTime;
        const currentScene = this.sceneMap.get(this.currentScene);
        if (currentScene?.isEnable && currentScene.isInitialized) {
            currentScene.update(deltaTime);
        }
    }
}
export default SceneController;
