import * as PIXI from "pixi.js";
import "./style.css";
import readyContainer from "./components/ReadyContainer";
import playingContainer from "./components/PlayingContainer";
import finishedContainer from "./components/FinishedContainer";

export const GAME_WIDTH = 800;
export const GAME_HEIHGT = 600;

export enum GameState {
  Ready,
  Playing,
  Finished,
}

let currentState: GameState = GameState.Ready;

(async () => {
  const app = new PIXI.Application();

  await app.init({
    background: "1099bb",
    width: GAME_WIDTH,
    height: GAME_HEIHGT,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  app.canvas.id = "app-canvas";
  document.body.appendChild(app.canvas);

  const switchState = (newState: GameState) => {
    currentState = newState;
    app.stage.removeChildren();

    if (currentState === GameState.Ready) {
      readyContainer(app, switchState);
    } else if (currentState === GameState.Playing) {
      playingContainer(app, switchState);
    } else if (currentState === GameState.Finished) {
      finishedContainer(app, switchState);
    }
  };

  switchState(GameState.Playing);
})();
