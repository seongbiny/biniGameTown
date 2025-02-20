import { Application, Container, Graphics, Text } from "pixi.js";
import { GameState } from "../main";

export default async function readyContainer(
  app: Application,
  switchState: (state: GameState) => void
) {
  const container = new Container();
  app.stage.addChild(container);

  const buttonWidth = 200;
  const buttonHeight = 50;

  const button = new Graphics();
  button.rect(0, 0, buttonWidth, buttonHeight).fill(0xffcc00);
  button.position.set((app.screen.width - buttonWidth) / 2, 250);
  button.eventMode = "static";
  button.cursor = "pointer";

  const buttonText = new Text("Start", {
    fontSize: 20,
    fill: 0x000000,
  });
  buttonText.anchor.set(0.5);
  buttonText.position.set(buttonWidth / 2, buttonHeight / 2);

  button.addChild(buttonText);
  button.on("pointerdown", () => {
    switchState(GameState.Playing);
  });

  container.addChild(button);

  return container;
}
