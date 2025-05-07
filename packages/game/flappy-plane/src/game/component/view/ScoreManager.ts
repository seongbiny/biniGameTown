import { EventEmitter } from 'pixi.js';
import { SoundPlayer } from '../../core/SoundPlayer';

export class ScoreManager extends EventEmitter {
  private static instance: ScoreManager;

  private score: number = 0;
  private highScore: number = 0;
  private readonly SCORE_KEY = 'flappyBird_score';
  private readonly HIGH_SCORE_KEY = 'flappyBird_highScore';

  private soundPlayer: SoundPlayer;

  private constructor() {
    super();
    this.loadScoresFromStorage();
    this.soundPlayer = SoundPlayer.getInstance();
  }

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  private loadScoresFromStorage(): void {
    try {
      const savedHighScore = localStorage.getItem(this.HIGH_SCORE_KEY);
      if (savedHighScore) {
        this.highScore = parseInt(savedHighScore, 10);
      }
    } catch (error) {
      console.error(
        '로컬 스토리지에서 점수를 불러오는 중 오류가 발생했습니다:',
        error
      );
    }
  }

  private saveScoresToStorage(): void {
    try {
      localStorage.setItem(this.SCORE_KEY, this.score.toString());
      localStorage.setItem(this.HIGH_SCORE_KEY, this.highScore.toString());
    } catch (error) {
      console.error(
        '로컬 스토리지에 점수를 저장하는 중 오류가 발생했습니다:',
        error
      );
    }
  }

  // 현재 점수를 가져옵니다
  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public setScore(score: number): void {
    this.score = score;
    this.updateHighScore();
    this.saveScoresToStorage();
    this.emit('scoreChanged', this.score);
    this.emit('highScoreChanged', this.highScore);
  }

  // 점수를 1점 증가
  public incrementScore(): void {
    this.score += 1;

    if (this.score % 5 === 0) {
      this.soundPlayer.play('levelup');
    }

    this.updateHighScore();
    this.saveScoresToStorage();
    this.emit('scoreChanged', this.score);
    this.emit('highScoreChanged', this.highScore);
  }

  private updateHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  public resetScore(): void {
    this.score = 0;
    this.saveScoresToStorage();
    this.emit('scoreChanged', this.score);
  }
}
