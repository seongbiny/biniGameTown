import { Application } from "pixi.js";
import { calculateStageSize } from "./game/utils/calculateStageSize";
import SceneController from "./game/core/SceneController";
import { assetsPreload } from "./assets/assetsPreload";

export class App {
  private app: Application = new Application();

  public size: { width: number; height: number; scale: number } = {
    width: 0,
    height: 0,
    scale: 1,
  };

  public async initialize() {
    this.size = calculateStageSize(450, 800);

    await this.app.init({
      width: this.size.width,
      height: this.size.height,
      background: "#F3F4F6",
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    this.app.stage.scale.set(this.size.scale);

    const container = document.getElementById("app")!;
    container?.appendChild(this.app.canvas);

    await assetsPreload();

    const sceneController = SceneController.getInstance();
    sceneController.initialize(this.app.stage);

    window.addEventListener("resize", () => {
      this.size = calculateStageSize(450, 800);
      this.app.renderer.resize(this.size.width, this.size.height);
      this.app.stage.scale.set(this.size.scale);
    });
  }

  public getApplication(): Application {
    return this.app;
  }
}

const app = new App();
app.initialize();
