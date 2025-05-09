import { Application } from "pixi.js";
import { calculateStageSize } from "./game/utils/calculateStageSize";
import { DEFAULT_CONFIG } from "./config";
import { Logger } from "./game/utils/logger";
import SceneController from "./game/core/SceneController";
import { assetsPreload } from "./assets/assetsPreload";
import "./fonts.css";
const { GAME_WIDTH, GAME_HEIGHT } = DEFAULT_CONFIG;
export class App {
    constructor() {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Application()
        });
        Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                width: 0,
                height: 0,
                scale: 1,
            }
        });
    }
    async initialize() {
        this.size = calculateStageSize(GAME_WIDTH, GAME_HEIGHT);
        await this.app.init({
            width: this.size.width,
            height: this.size.height,
            background: "#333333",
        });
        this.app.stage.scale.set(this.size.scale);
        const container = document.getElementById("app");
        container?.appendChild(this.app.canvas);
        Logger.initialize("game/flappy-plane");
        await assetsPreload();
        // SceneController 초기화
        const sceneController = SceneController.getInstance();
        sceneController.initialize(this.app.stage);
        window.addEventListener("resize", () => {
            this.size = calculateStageSize(GAME_WIDTH, GAME_HEIGHT);
            this.app.renderer.resize(this.size.width, this.size.height);
            this.app.stage.scale.set(this.size.scale);
        });
    }
    getApplication() {
        return this.app;
    }
}
const app = new App();
app.initialize();
