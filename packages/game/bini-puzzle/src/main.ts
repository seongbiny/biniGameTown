import * as PIXI from 'pixi.js';
import { calculateStageSize } from './game/utils/calculateStageSize';
import { GameStatus } from './game/types';
import { initializeScene } from './game/core/sceneController';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from './config/constants';
import './style.css';

declare global {
  var __PIXI_APP__: PIXI.Application;
}

(async () => {
  const stageSize = calculateStageSize(GAME_WIDTH, GAME_HEIGHT);

  const app = new PIXI.Application();
  await app.init({
    background: COLORS.PRIMARY,

    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  app.renderer.resize(stageSize.width, stageSize.height);
  app.stage.scale.set(stageSize.scale);

  globalThis.__PIXI_APP__ = app;

  app.canvas.id = 'app-canvas';
  document.body.appendChild(app.canvas);

  // 캔버스를 화면 중앙에 배치
  app.canvas.style.position = 'absolute';
  app.canvas.style.left = '50%';
  app.canvas.style.top = '50%';
  app.canvas.style.transform = 'translate(-50%, -50%)';

  initializeScene(app, { status: GameStatus.MAIN });

  window.addEventListener('resize', () => {
    const newSize = calculateStageSize(GAME_WIDTH, GAME_HEIGHT);
    app.renderer.resize(newSize.width, newSize.height);
    app.stage.scale.set(newSize.scale);
  });
})();
