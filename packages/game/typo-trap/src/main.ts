import { Application } from "pixi.js";
import { calculateStageSize } from "./game/utils/calculateStageSize";

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
      background: "#333333",
    });
    this.app.stage.scale.set(this.size.scale);

    const container = document.getElementById("app")!;
    container?.appendChild(this.app.canvas);

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
