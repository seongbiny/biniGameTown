import { Application, Container } from 'pixi.js';
import type { GameInstance } from '@biniverse/game-sdk';
import type { GameStatus, GameOverReason } from './types';
import { GAME_CONFIG } from './constants';
import { stages } from './data/stages';
import { shuffle } from '../shared/utils/shuffle';
import { ReadyScene } from './scenes/ReadyScene';
import { PlayingScene } from './scenes/PlayingScene';
import { CorrectScene } from './scenes/CorrectScene';
import { GameOverScene } from './scenes/GameOverScene';
import { ClearScene } from './scenes/ClearScene';

export class TypoTrapGame implements GameInstance {
  private app: Application | null = null;
  private status: GameStatus = 'ready';
  private currentStageIndex: number = 0;
  private remainingTime: number = GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS;
  private currentScene: Container | null = null;
  private playingScene: PlayingScene | null = null;

  async init(container: HTMLElement): Promise<void> {
    this.app = new Application();

    await this.app.init({
      width: GAME_CONFIG.CANVAS_WIDTH,
      height: GAME_CONFIG.CANVAS_HEIGHT,
      backgroundColor: 0x1a1a2e,
    });

    container.appendChild(this.app.canvas);

    this.app.ticker.add((ticker) => {
      if (this.status !== 'playing' || !this.playingScene) return;

      this.remainingTime -= ticker.deltaMS / 1000;

      if (this.remainingTime <= 0) {
        this.remainingTime = 0;
        this.playingScene.update(0);
        this.showGameOver('timeout');
        return;
      }

      this.playingScene.update(this.remainingTime);
    });
  }

  start(): void {
    this.showReady();
  }

  pause(): void {
    if (this.status === 'playing') this.status = 'correct';
  }

  resume(): void {
    if (this.status === 'correct') this.showPlaying();
  }

  destroy(): void {
    if (!this.app) return;

    this.app.destroy(true, { children: true, texture: true });
    this.app = null;
  }

  private showScene(scene: Container): void {
    if (!this.app) return;

    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true });
      this.currentScene = null;
    }

    this.playingScene = null;
    this.currentScene = scene;
    this.app.stage.addChild(scene);
  }

  private showReady(): void {
    this.status = 'ready';
    this.showScene(new ReadyScene(() => this.onStart()));
  }

  private onStart(): void {
    this.currentStageIndex = 0;
    this.showPlaying();
  }

  private showPlaying(): void {
    this.status = 'playing';
    this.remainingTime = GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS;

    const stage = stages[this.currentStageIndex]!;
    const shuffledStage = { ...stage, options: shuffle(stage.options) };
    const scene = new PlayingScene(shuffledStage, this.currentStageIndex, (word) =>
      this.onWordSelect(word),
    );

    this.showScene(scene);
    this.playingScene = scene;
  }

  private onWordSelect(word: string): void {
    if (this.status !== 'playing') return;

    const stage = stages[this.currentStageIndex]!;

    if (word === stage.answer) {
      this.status = 'correct';
      this.showScene(new CorrectScene(() => this.onNext()));
    } else {
      this.showGameOver('wrong');
    }
  }

  private onNext(): void {
    const isLastStage = this.currentStageIndex >= GAME_CONFIG.TOTAL_STAGE_COUNT - 1;

    if (isLastStage) {
      this.showClear();
    } else {
      this.currentStageIndex += 1;
      this.showPlaying();
    }
  }

  private showGameOver(reason: GameOverReason): void {
    this.status = 'gameOver';
    this.showScene(new GameOverScene(reason, () => this.onRestart()));
  }

  private showClear(): void {
    this.status = 'clear';
    this.showScene(new ClearScene(() => this.onRestart()));
  }

  private onRestart(): void {
    this.currentStageIndex = 0;
    this.showReady();
  }
}
